"""Checks the sample reports written by tests/run-tests.js are valid PDF and Word files.

Run from the repo root: python3 .github/scripts/check_reports.py <folder>
"""
import os
import re
import sys
import zipfile
from xml.dom import minidom

folder = sys.argv[1]
errors = []
files = sorted(os.listdir(folder)) if os.path.isdir(folder) else []
if not any(f.endswith(".pdf") for f in files) or not any(f.endswith(".docx") for f in files):
    errors.append(f"no sample PDF or Word files in {folder}")

for name in files:
    path = os.path.join(folder, name)
    if name.endswith(".pdf"):
        b = open(path, "rb").read()
        start = int(re.search(rb"startxref\n(\d+)", b).group(1))
        if b[start:start + 4] != b"xref":
            errors.append(f"{name}: startxref does not point at the xref table")
        for i, off in enumerate(int(x) for x in re.findall(rb"(\d{10}) 00000 n", b)):
            if not b[off:].startswith(f"{i + 1} 0 obj".encode()):
                errors.append(f"{name}: object {i + 1} is not at its xref offset")
        for m in re.finditer(rb"<< /Length (\d+) >>\nstream\n", b):
            if b[m.end() + int(m.group(1)):m.end() + int(m.group(1)) + 10] != b"\nendstream":
                errors.append(f"{name}: a stream length is wrong")
        print(f"ok    {name}: {b.count(b'/Type /Page ')} page(s)")
    elif name.endswith(".docx"):
        with zipfile.ZipFile(path) as z:
            if z.testzip() is not None:
                errors.append(f"{name}: damaged zip entry")
            for part in z.namelist():
                if part.endswith((".xml", ".rels")):
                    try:
                        minidom.parseString(z.read(part))
                    except Exception as e:  # noqa: BLE001 - report any parse failure
                        errors.append(f"{name}: {part} is not valid XML ({e})")
            if "word/document.xml" not in z.namelist():
                errors.append(f"{name}: no document body")
        print(f"ok    {name}: {len(z.namelist())} parts")

for e in errors:
    print(f"FAIL  {e}")
sys.exit(1 if errors else 0)
