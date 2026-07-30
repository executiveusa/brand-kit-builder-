import json

with open(r'C:\Users\execu\Documents\kimi\workspace\demo-brand-book.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Escape for JavaScript string - use document.write approach
payload = {
    "action": "evaluate",
    "args": {
        "code": f"""
document.open();
document.write({json.dumps(html)});
document.close();
""".strip()
    },
    "session": "pauli-brand-demo"
}

with open(r'C:\Users\execu\AppData\Local\Temp\webbridge-req-inject.json', 'w', encoding='utf-8') as f:
    json.dump(payload, f)

print(f"HTML size: {len(html)} bytes")
print("Payload written successfully")
