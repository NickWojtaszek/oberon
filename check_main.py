import os

# Check the actual state of main.tsx
main_file = r'C:\Users\mikol_5j7kx3s\Desktop\oberon\src\main.tsx'

with open(main_file, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()
    first_100_chars = content[:100]
    print("First 100 characters of src/main.tsx:")
    print(repr(first_100_chars))
    
    # Check what it starts with
    if content.lstrip().startswith('import'):
        print("\n✓ main.tsx correctly starts with 'import'")
    elif content.startswith('```'):
        print("\n✗ main.tsx STILL starts with backticks")
    else:
        print(f"\n? main.tsx starts with: {content[:30]}")
