import os
import re

src_dir = r'C:\Users\mikol_5j7kx3s\Desktop\oberon\src'
fixed_files = []

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
                
                # Check if file starts with triple backticks
                if content.startswith('```'):
                    # Remove opening backticks line
                    content = re.sub(r'^\`\`\`(tsx|ts|jsx|js|typescript|javascript)?\s*\n', '', content)
                    # Remove closing backticks line
                    content = re.sub(r'\n\s*\`\`\`\s*$', '', content)
                    
                    # Write the cleaned content back
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    
                    fixed_files.append(filepath)
            except Exception as e:
                print(f"Error processing {filepath}: {e}")

if fixed_files:
    print(f"Fixed {len(fixed_files)} corrupted files:")
    for f in fixed_files:
        # Print relative path for readability
        rel_path = os.path.relpath(f, r'C:\Users\mikol_5j7kx3s\Desktop\oberon')
        print(f"  - {rel_path}")
else:
    print("No corrupted files found to fix")
