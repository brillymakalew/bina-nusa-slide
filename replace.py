import os

replacements = {
    "Visi transformasi digital perusahaan terdokumentasi dan dikomunikasikan secara jelas.": "Visi transformasi digital perusahaan terdokumentasi secara jelas.",
    "Dampak lingkungan dipertimbangkan secara sistematis dalam perencanaan dan pelaksanaan inisiatif transformasi digital.": "Dampak lingkungan dipertimbangkan secara sistematis dalam perencanaan inisiatif transformasi digital.",
    "Peran dan akuntabilitas terkait transformasi digital ditetapkan secara jelas di tingkat organisasi.": "Akuntabilitas terkait transformasi digital ditetapkan secara jelas di tingkat organisasi.",
    "Inisiatif transformasi digital dirancang untuk memperkuat model bisnis dan proposisi nilai perusahaan.": "Inisiatif transformasi digital dirancang untuk memperkuat model bisnis perusahaan.",
    "Setiap proyek digital dievaluasi berdasarkan kontribusinya terhadap cara perusahaan menciptakan dan menangkap nilai.": "Setiap proyek digital dievaluasi berdasarkan kontribusinya terhadap cara perusahaan menciptakan nilai.",
    "Perencanaan transformasi digital mempertimbangkan persyaratan regulasi dan kepatuhan yang relevan.": "Perencanaan transformasi digital mempertimbangkan persyaratan regulasi yang relevan.",
    "Perubahan regulasi eksternal dipantau secara rutin dan digunakan sebagai masukan dalam perencanaan transformasi digital.": "Perubahan regulasi eksternal dipantau secara rutin.",
    "Pimpinan organisasi memandang transformasi digital sebagai kebutuhan yang mendesak untuk keberlangsungan dan daya saing perusahaan.": "Pimpinan organisasi memandang transformasi digital sebagai kebutuhan yang mendesak untuk menjaga daya saing perusahaan.",
    "Sistem dan aplikasi utama perusahaan terintegrasi sehingga meminimalkan duplikasi input data dan pekerjaan manual.": "Sistem utama perusahaan terintegrasi secara digital.",
    "Data penting dapat mengalir secara otomatis antar sistem dan aplikasi utama.": "Data penting dapat mengalir secara otomatis antar sistem utama.",
    "Perusahaan memiliki platform data dan analitik yang memadai untuk mendukung pemantauan kinerja dan pengambilan keputusan.": "Perusahaan memiliki platform data yang memadai untuk mendukung pengambilan keputusan.",
    "Kontrol keamanan informasi dan perlindungan data pribadi diterapkan secara memadai.": "Perlindungan data pribadi diterapkan secara memadai.",
    "Risiko keamanan siber diidentifikasi dan ditangani secara berkala.": "Risiko keamanan siber diidentifikasi secara berkala.",
    "Pimpinan puncak secara aktif menjadi sponsor dan teladan dalam inisiatif transformasi digital.": "Pimpinan puncak secara aktif menjadi sponsor inisiatif transformasi digital.",
    "Karyawan memiliki literasi dan kompetensi digital yang memadai untuk mendukung perubahan cara kerja.": "Karyawan memiliki kompetensi digital yang memadai untuk mendukung perubahan cara kerja.",
    "Organisasi secara berkala memetakan kesenjangan kompetensi digital karyawan dan menindaklanjutinya.": "Organisasi secara berkala memetakan kesenjangan kompetensi digital karyawan.",
    "Perusahaan menyediakan program pelatihan/reskilling/upskilling yang relevan dengan kebutuhan transformasi digital.": "Perusahaan menyediakan program pelatihan digital yang relevan dengan kebutuhan transformasi digital.",
    "Karyawan memiliki kesempatan yang memadai untuk mengikuti pelatihan terkait teknologi dan cara kerja digital.": "Karyawan memiliki kesempatan yang memadai untuk mengikuti pelatihan terkait teknologi digital.",
    "Budaya organisasi mendorong eksperimen dan uji coba solusi digital baru.": "Budaya organisasi mendorong eksperimen terhadap solusi digital baru.",
    "Ide inovasi digital dari karyawan diapresiasi dan ditindaklanjuti melalui mekanisme yang jelas.": "Ide inovasi digital dari karyawan ditindaklanjuti melalui mekanisme yang jelas.",
    "Kolaborasi lintas fungsi/divisi difasilitasi dalam merancang dan menjalankan inisiatif transformasi digital.": "Kolaborasi lintas fungsi/divisi difasilitasi dalam menjalankan inisiatif transformasi digital.",
    "Pembelajaran dan praktik terbaik terkait digital dibagikan secara aktif antar unit organisasi.": "Pembelajaran terkait digital dibagikan secara aktif antar unit organisasi.",
    "Keputusan manajerial penting didasarkan pada data dan analitik.": "Keputusan manajerial penting didasarkan pada data.",
    "Transformasi digital diperlukan untuk menjaga keberlangsungan dan kesehatan finansial bisnis dalam jangka panjang.": "Transformasi digital diperlukan untuk menjaga keberlangsungan bisnis dalam jangka panjang.",
    "Tanpa transformasi digital, perusahaan akan kesulitan bertahan menghadapi perubahan dan tekanan kompetitif.": "Tanpa transformasi digital, ketahanan bisnis perusahaan akan melemah.",
    "Pelanggan semakin mengharapkan layanan dan interaksi yang serba digital.": "Pelanggan semakin mengharapkan layanan yang serba digital.",
    "Regulasi dan standar industri mendorong perusahaan menjadi lebih digital.": "Regulasi mendorong perusahaan menjadi lebih digital.",
    "Data dan teknologi digital diperlukan untuk mengukur dan melaporkan kinerja lingkungan (misalnya emisi atau konsumsi energi).": "Teknologi digital diperlukan untuk mengukur kinerja lingkungan (misalnya emisi atau konsumsi energi)."
}

for filename in ["index.html", "source.html"]:
    with open(f"c:/github_repo/dti-deck/{filename}", "r", encoding="utf-8") as f:
        content = f.read()
    
    for old_str, new_str in replacements.items():
        content = content.replace(old_str, new_str)
        
    with open(f"c:/github_repo/dti-deck/{filename}", "w", encoding="utf-8") as f:
        f.write(content)

print("Done")
