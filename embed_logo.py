import base64
import os
import re

# Source image
src_img = r"C:\Users\LENOVO\.gemini\antigravity-ide\brain\52fd3993-77d4-42b7-af96-db0a51f055f4\.user_uploaded\media_1789476022968.png"
dst_img = r"C:\Users\LENOVO\.gemini\antigravity-ide\scratch\jay-dwarkadhis-travels\assets\logo.png"
index_html = r"C:\Users\LENOVO\.gemini\antigravity-ide\scratch\jay-dwarkadhis-travels\index.html"

# Ensure assets dir exists
os.makedirs(os.path.dirname(dst_img), exist_ok=True)

# Read binary image
with open(src_img, "rb") as f:
    img_data = f.read()

# Write to assets/logo.png
with open(dst_img, "wb") as f:
    f.write(img_data)

# Encode to Base64
b64_str = base64.b64encode(img_data).decode("utf-8")
data_uri = f"data:image/png;base64,{b64_str}"

# Read index.html
with open(index_html, "r", encoding="utf-8") as f:
    content = f.read()

# Replace img tag inside logoContainer with base64 data URI and fallback
pattern = r'(<div class="avatar-inner" id="logoContainer">)(.*?)(</div>)'
replacement = f'\\1\n            <img src="{data_uri}" alt="JAY DWARKADHIS TRAVELS Official Logo" class="brand-exact-logo">\n          \\3'

new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open(index_html, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"SUCCESS: logo.png written ({len(img_data)} bytes) and embedded as Base64 in index.html!")
