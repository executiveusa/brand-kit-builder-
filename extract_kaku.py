import pypdf

reader = pypdf.PdfReader(open(r"E:/THE PAULI FILES/KAKU_BrandBook_2022_VF (2) (1).pdf", "rb"))
print(f"Total pages: {len(reader.pages)}")
print(f"--- METADATA ---")
for k, v in reader.metadata.items():
    print(f"{k}: {v}")
print(f"\n--- EXTRACTED TEXT ---")
for i, page in enumerate(reader.pages):
    text = page.extract_text()
    if text and text.strip():
        print(f"\n=== PAGE {i+1} ===")
        print(text[:3000] if len(text) > 3000 else text)
