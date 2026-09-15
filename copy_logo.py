import shutil
import os

src = r"C:\Users\LENOVO\.gemini\antigravity-ide\brain\52fd3993-77d4-42b7-af96-db0a51f055f4\.user_uploaded\media_1789476022968.png"
dst = r"C:\Users\LENOVO\.gemini\antigravity-ide\scratch\jay-dwarkadhis-travels\assets\logo.png"

os.makedirs(os.path.dirname(dst), exist_ok=True)
shutil.copy2(src, dst)
print("SUCCESS: Logo copied to", dst)
