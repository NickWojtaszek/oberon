import os
import re

src_dir = r'C:\Users\mikol_5j7kx3s\Desktop\oberon\src'
issues = []

for root, dirs, files in os.walk(src_dir):
    # Skip node_modules
    if 'node_modules' in root:
        continue
    
    for file in files:
        if file.endswith(('.ts', '.tsx')):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                # Check if file STARTS with triple backticks
                if content.startswith('```'):
                    issues.append((filepath, 'STARTS_WITH_BACKTICKS'))
                
                # Check if file ends with triple backticks
                if content.rstrip().endswith('```'):
                    issues.append((filepath, 'ENDS_WITH_BACKTICKS'))
                    
            except Exception as e:
                pass

if issues:
    print(f"Found {len(issues)} issues:")
    for filepath, issue_type in issues:
        rel_path = os.path.relpath(filepath, r'C:\Users\mikol_5j7kx3s\Desktop\oberon')
        print(f"  {rel_path}: {issue_type}")
else:
    print("All TS/TSX files are clean - no markdown wrapper issues found")
