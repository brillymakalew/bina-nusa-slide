import re

def fix_file(filename):
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # 1. Replace I1, I2, I4-I6
        content = content.replace("I1, I2, I4-I6", "I1 - I5")
        
        # 2. Replace the <!-- I4 --> headers
        content = content.replace("<!-- I4 -->", "<!-- I3 -->")
        content = content.replace("<!-- I5 -->", "<!-- I4 -->")
        content = content.replace("<!-- I6 -->", "<!-- I5 -->")
        
        # 3. Replace the indicator badges <div class="indicator-badge">I4</div>
        content = content.replace('<div class="indicator-badge">I4</div>', '<div class="indicator-badge">I3</div>')
        content = content.replace('<div class="indicator-badge">I5</div>', '<div class="indicator-badge">I4</div>')
        content = content.replace('<div class="indicator-badge">I6</div>', '<div class="indicator-badge">I5</div>')
        
        # 4. Replace the recap card headers
        content = content.replace('<h4>I4: Kapasitas analitik', '<h4>I3: Kapasitas analitik')
        content = content.replace('<h4>I5: Keamanan siber', '<h4>I4: Keamanan siber')
        content = content.replace('<h4>I6: Pemanfaatan teknologi digital', '<h4>I5: Pemanfaatan teknologi digital')

        # 5. Replace item codes <span class="item-code">I4.1</span> etc.
        # We can use regex to safely replace I4.x -> I3.x, I5.x -> I4.x, I6.x -> I5.x
        content = re.sub(r'(>|\s)I4\.(\d)(<|\s)', r'\g<1>I3.\g<2>\g<3>', content)
        content = re.sub(r'(>|\s)I5\.(\d)(<|\s)', r'\g<1>I4.\g<2>\g<3>', content)
        content = re.sub(r'(>|\s)I6\.(\d)(<|\s)', r'\g<1>I5.\g<2>\g<3>', content)

        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {filename}")
    except FileNotFoundError:
        pass

for f in ["c:/github_repo/dti-deck/index.html", "c:/github_repo/dti-deck/source.html"]:
    fix_file(f)
