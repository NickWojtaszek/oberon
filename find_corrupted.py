import os
import re

src_dir = r'C:\Users\mikol_5j7kx3s\Desktop\oberon\src'
corrupted_files = []

for root, dirs, files in os.walk(src_dir):
    # Skip node_modules
    if 'node_modules' in root:
        continue
    
    for file in files:
        if file.endswith(('.ts', '.tsx')):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                    first_line = f.readline().strip()
                    if first_line.startswith('```'):
                        corrupted_files.append(filepath)
            except:
                pass

if corrupted_files:
    print(f"Found {len(corrupted_files)} corrupted files:")
    for f in corrupted_files:
        print(f)
else:
    print("No corrupted files found")
