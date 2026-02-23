(() => {
  const app = document.getElementById("app");
  const source = document.getElementById("slides-source");
  const stage = document.getElementById("stage");
  const frame = document.getElementById("slide-frame");

  const btnPrev = document.getElementById("btnPrev");
  const btnNext = document.getElementById("btnNext");
  const btnFs = document.getElementById("btnFullscreen");
  const counter = document.getElementById("counter");

  const slides = Array.from(source.querySelectorAll(".slide-container"));
  if (!slides.length) {
    frame.innerHTML = `
      <div style="color:#e2e8f0; padding:24px; font-family:Inter,sans-serif;">
        No slides found. Make sure you pasted all <code>.slide-container</code> blocks into #slides-source.
      </div>
    `;
    return;
  }

  // --- Controls auto-hide ---
  let hideTimer = null;
  const SHOW_FOR_MS = 1800;

  function showControlsTemporarily() {
    app.classList.add("controls-visible");
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(() => app.classList.remove("controls-visible"), SHOW_FOR_MS);
  }

  ["mousemove", "mousedown", "touchstart", "touchmove", "keydown"].forEach((evt) => {
    window.addEventListener(evt, showControlsTemporarily, { passive: true });
  });
  setTimeout(showControlsTemporarily, 50);

  // --- Slide state ---
  let idx = 0;
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  function readHashIndex() {
    const m = window.location.hash.match(/^#(\d+)$/);
    if (!m) return 0;
    const h = parseInt(m[1], 10);
    if (Number.isNaN(h)) return 0;
    return clamp(h - 1, 0, slides.length - 1);
  }
  function writeHashIndex() {
    window.location.hash = `#${idx + 1}`;
  }

  // --- Zoom/Pan state ---
  const DESIGN_W = 1280;
  const DESIGN_H = 720;

  let fitScale = 1;     // scale to fit viewport
  let zoom = 1;         // extra zoom multiplier (>=1)
  let panX = 0;         // pan in screen px
  let panY = 0;

  let isPanning = false;
  let panStartX = 0;
  let panStartY = 0;
  let panOriginX = 0;
  let panOriginY = 0;

  function resetView() {
    zoom = 1;
    panX = 0;
    panY = 0;
    applyTransform();
  }

  function availableRect() {
    return stage.getBoundingClientRect();
  }

  function computeFitScale() {
    const rect = availableRect();
    fitScale = Math.min(rect.width / DESIGN_W, rect.height / DESIGN_H);
  }

  function applyTransform() {
    const rect = availableRect();

    // base placement (centered) for fit
    const baseLeft = (rect.width - DESIGN_W * fitScale) / 2;
    const baseTop = (rect.height - DESIGN_H * fitScale) / 2;

    // total scale
    const totalScale = fitScale * zoom;

    // Clamp pan so you can't lose the slide completely
    const scaledW = DESIGN_W * totalScale;
    const scaledH = DESIGN_H * totalScale;

    // If scaled smaller than viewport (shouldn't happen when zoom>=1, but safe):
    const minX = Math.min(0, rect.width - scaledW);
    const maxX = Math.max(0, rect.width - scaledW);
    const minY = Math.min(0, rect.height - scaledH);
    const maxY = Math.max(0, rect.height - scaledH);

    panX = clamp(panX, minX, maxX);
    panY = clamp(panY, minY, maxY);

    // Pixel snap translate for crispness
    const tx = Math.round(baseLeft + panX);
    const ty = Math.round(baseTop + panY);

    frame.style.transform = `translate(${tx}px, ${ty}px) scale(${totalScale})`;
  }

  function scaleToFit() {
    computeFitScale();
    // keep current zoom/pan but re-apply transform for new viewport
    applyTransform();
  }

  function renderSlide() {
    frame.innerHTML = "";
    frame.appendChild(slides[idx]);

    counter.textContent = `${idx + 1} / ${slides.length}`;
    btnPrev.disabled = idx === 0;
    btnNext.disabled = idx === slides.length - 1;
    btnPrev.style.opacity = btnPrev.disabled ? "0.5" : "1";
    btnNext.style.opacity = btnNext.disabled ? "0.5" : "1";

    // Reset zoom/pan per slide (comment these 3 lines if you want zoom to persist across slides)
    zoom = 1;
    panX = 0;
    panY = 0;

    requestAnimationFrame(() => {
      scaleToFit();
      writeHashIndex();
    });
  }

  function go(delta) {
    const next = clamp(idx + delta, 0, slides.length - 1);
    if (next === idx) return;
    idx = next;
    renderSlide();
    showControlsTemporarily();
  }

  function goTo(n) {
    idx = clamp(n, 0, slides.length - 1);
    renderSlide();
    showControlsTemporarily();
  }

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen({ navigationUI: "hide" });
      } else {
        await document.exitFullscreen();
      }
    } catch (e) {
      console.error(e);
    } finally {
      updateFsButton();
      requestAnimationFrame(scaleToFit);
      showControlsTemporarily();
    }
  }

  function updateFsButton() {
    const icon = btnFs.querySelector("i");
    const label = btnFs.querySelector("span");
    const isFs = !!document.fullscreenElement;

    if (isFs) {
      icon.className = "fa-solid fa-compress";
      label.textContent = "Exit Fullscreen";
      btnFs.title = "Exit Fullscreen (F)";
    } else {
      icon.className = "fa-solid fa-expand";
      label.textContent = "Fullscreen";
      btnFs.title = "Fullscreen (F)";
    }
  }

  // --- Wheel zoom (zoom at cursor) ---
  function wheelZoom(e) {
    // Let user scroll page? We want zoom instead.
    e.preventDefault();
    showControlsTemporarily();

    const rect = availableRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    const prevZoom = zoom;
    const delta = -e.deltaY;

    // Smooth zoom factor
    const factor = delta > 0 ? 1.10 : 0.90;
    zoom = clamp(zoom * factor, 1, 6); // 1x..6x

    // Adjust pan so the point under cursor stays under cursor
    // Convert cursor point into slide-space proportions
    const totalPrev = fitScale * prevZoom;
    const totalNext = fitScale * zoom;

    const baseLeft = (rect.width - DESIGN_W * fitScale) / 2;
    const baseTop = (rect.height - DESIGN_H * fitScale) / 2;

    // Current content top-left in screen coords
    const prevLeft = baseLeft + panX;
    const prevTop = baseTop + panY;

    // Cursor position relative to content, in content pixels
    const relX = (cx - prevLeft) / totalPrev;
    const relY = (cy - prevTop) / totalPrev;

    // New content top-left required to keep relX/relY under cursor
    const nextLeft = cx - relX * totalNext;
    const nextTop = cy - relY * totalNext;

    panX = nextLeft - baseLeft;
    panY = nextTop - baseTop;

    applyTransform();
  }

  // --- Drag to pan (only meaningful when zoom > 1, but allowed always) ---
  function onPointerDown(e) {
    // ignore clicks on buttons
    if (e.target.closest && e.target.closest("#controls")) return;

    isPanning = true;
    stage.classList.add("is-panning");
    stage.setPointerCapture?.(e.pointerId);

    panStartX = e.clientX;
    panStartY = e.clientY;
    panOriginX = panX;
    panOriginY = panY;
  }

  function onPointerMove(e) {
    if (!isPanning) return;
    const dx = e.clientX - panStartX;
    const dy = e.clientY - panStartY;
    panX = panOriginX + dx;
    panY = panOriginY + dy;
    applyTransform();
  }

  function onPointerUp(e) {
    if (!isPanning) return;
    isPanning = false;
    stage.classList.remove("is-panning");
    stage.releasePointerCapture?.(e.pointerId);
  }

  // --- Double click toggle zoom ---
  function onDblClick(e) {
    if (e.target.closest && e.target.closest("#controls")) return;

    const rect = availableRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    const prevZoom = zoom;
    const targetZoom = (zoom === 1) ? 2 : 1;

    // zoom at cursor
    const totalPrev = fitScale * prevZoom;

    const baseLeft = (rect.width - DESIGN_W * fitScale) / 2;
    const baseTop = (rect.height - DESIGN_H * fitScale) / 2;
    const prevLeft = baseLeft + panX;
    const prevTop = baseTop + panY;

    const relX = (cx - prevLeft) / totalPrev;
    const relY = (cy - prevTop) / totalPrev;

    zoom = targetZoom;

    const totalNext = fitScale * zoom;
    const nextLeft = cx - relX * totalNext;
    const nextTop = cy - relY * totalNext;

    panX = nextLeft - baseLeft;
    panY = nextTop - baseTop;

    applyTransform();
    showControlsTemporarily();
  }

  // --- Events ---
  btnPrev.addEventListener("click", () => go(-1));
  btnNext.addEventListener("click", () => go(1));
  btnFs.addEventListener("click", toggleFullscreen);

  window.addEventListener("resize", () => requestAnimationFrame(scaleToFit));
  document.addEventListener("fullscreenchange", () => {
    updateFsButton();
    requestAnimationFrame(scaleToFit);
    showControlsTemporarily();
  });

  window.addEventListener("hashchange", () => {
    const h = readHashIndex();
    if (h !== idx) goTo(h);
  });

  // keyboard
  window.addEventListener("keydown", (e) => {
    const t = e.target;
    const isTyping =
      t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
    if (isTyping) return;

    switch (e.key) {
      case "ArrowRight":
      case "PageDown":
      case " ":
        e.preventDefault();
        go(1);
        break;
      case "ArrowLeft":
      case "PageUp":
        e.preventDefault();
        go(-1);
        break;
      case "Home":
        e.preventDefault();
        goTo(0);
        break;
      case "End":
        e.preventDefault();
        goTo(slides.length - 1);
        break;
      case "f":
      case "F":
        e.preventDefault();
        toggleFullscreen();
        break;
      case "0":
        e.preventDefault();
        resetView();
        showControlsTemporarily();
        break;
      case "+":
      case "=":
        e.preventDefault();
        zoom = clamp(zoom * 1.12, 1, 6);
        applyTransform();
        showControlsTemporarily();
        break;
      case "-":
      case "_":
        e.preventDefault();
        zoom = clamp(zoom / 1.12, 1, 6);
        applyTransform();
        showControlsTemporarily();
        break;
      default:
        break;
    }
  });

  // zoom + pan
  stage.addEventListener("wheel", wheelZoom, { passive: false });
  stage.addEventListener("pointerdown", onPointerDown);
  stage.addEventListener("pointermove", onPointerMove);
  stage.addEventListener("pointerup", onPointerUp);
  stage.addEventListener("pointercancel", onPointerUp);
  stage.addEventListener("dblclick", onDblClick);

  // Init
  idx = readHashIndex();
  updateFsButton();
  renderSlide();
})();