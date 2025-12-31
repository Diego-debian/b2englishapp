
import urllib.request
import json
import urllib.parse
import time

BASE = "http://localhost:8000"

def req(path, method="GET", data=None, token=None, content_type="application/json"):
    url = BASE + path
    headers = {}
    if content_type:
        headers["Content-Type"] = content_type
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    body = None
    if data:
        if content_type == "application/x-www-form-urlencoded":
             body = urllib.parse.urlencode(data).encode('utf-8')
        else:
             body = json.dumps(data).encode('utf-8')
    
    r = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(r) as f:
            return json.loads(f.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        try:
             return json.loads(e.read().decode())
        except:
             return {"error": str(e)}

# 1. Auth
u = f"audit_block_{int(time.time())}"
req("/register", "POST", {"username": u, "email": f"{u}@test.com", "password": "password123"})
token_resp = req("/token", "POST", {"username": u, "password": "password123"}, content_type="application/x-www-form-urlencoded")
token = token_resp.get("access_token")

# 2. Scanning
print("Scanning for dangerous questions...")
activities = req("/activities", token=token)

print(f"{'ID':<4} | {'Kind':<25} | {'Opts':<4} | {'Prompt':<40} | {'Status'}")
print("-" * 100)

for act in activities:
    qs = req(f"/activities/{act['id']}/questions", token=token)
    for q in qs:
        # Risk Analysis
        risk = []
        
        # 1. Options check for MCQs
        is_mcq = q['kind'] in ["choice", "mcq", "multiple_choice", "true_false"]
        options = q.get('options')
        opt_len = len(options) if options else 0
        
        if is_mcq and opt_len == 0:
            risk.append("MCQ_NO_OPTIONS")
            
        # 2. Null Prompt
        if not q.get('prompt'):
            risk.append("NO_PROMPT")
            
        # 3. Weird Kind
        known_kinds = ["choice", "mcq", "multiple_choice", "true_false", "text", "input"]
        # Also adding backend ones noticed before to see if they are handled
        # sentence_correction, sentence_transformation, sentence_ordering, sentence_combination
        if q['kind'] not in known_kinds and q['kind'] not in ["sentence_ordering", "sentence_combination", "sentence_correction", "sentence_transformation"]:
             risk.append(f"UNKNOWN_KIND_{q['kind']}")

        # 4. Sentence Ordering Risk (If it expects options but has none)
        if q['kind'] == "sentence_ordering" and opt_len == 0:
             risk.append("ORDERING_NO_ITEMS")

        if risk:
            print(f"{q['id']:<4} | {q['kind']:<25} | {opt_len:<4} | {q['prompt'][:40]:<40} | FAIL: {', '.join(risk)}")
        elif q['kind'] in ["sentence_ordering", "sentence_combination", "sentence_correction", "sentence_transformation"]:
             # Warn about these just to check if frontend handles them
             print(f"{q['id']:<4} | {q['kind']:<25} | {opt_len:<4} | {q['prompt'][:40]:<40} | WARN: Complex Kind")

