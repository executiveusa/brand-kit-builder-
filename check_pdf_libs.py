import sys

libs = ['PyPDF2', 'pdfplumber', 'pymupdf', 'fitz']
for lib in libs:
    try:
        __import__(lib)
        print(f"OK: {lib}")
    except ImportError:
        print(f"MISSING: {lib}")
