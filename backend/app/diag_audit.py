
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

# 1. Register/Login
u = f"audit_{int(time.time())}"
req("/register", "POST", {"username": u, "email": f"{u}@test.com", "password": "password123"})
token_resp = req("/token", "POST", {"username": u, "password": "password123"}, content_type="application/x-www-form-urlencoded")
token = token_resp.get("access_token")

# 2. Scan for questions
acts = req("/activities", token=token)

choice_qs = []
text_qs = []

for idx, a in enumerate(acts):
    qs = req(f"/activities/{a['id']}/questions", token=token)
    for q in qs:
        # Check for choice
        k = q.get("kind", "").lower()
        if "choice" in k or "mcq" in k:
            if len(choice_qs) < 2:
                choice_qs.append(q)
        # Check for text
        if "text" in k or "input" in k or k == "qa":
             if len(text_qs) < 1:
                text_qs.append(q)
    
    if len(choice_qs) >= 2 and len(text_qs) >= 1:
        break

print("=== CHOICE QUESTIONS ===")
print(json.dumps(choice_qs, indent=2))
print("=== TEXT QUESTIONS ===")
print(json.dumps(text_qs, indent=2))

# 3. Submit Examples need to reflect these
# We will use one of the choice questions for submit (since I know the answer or can guess)
# Actually, I'll just reuse the previous submit logic if I can find a question.
# I'll output raw responses using the first choice q.

if choice_qs:
    q = choice_qs[0]
    # Start attempt
    att = req("/attempts/start", "POST", {"activity_id": q["activity_id"]}, token=token)
    
    # Incorrect
    wrong = req("/attempts/submit", "POST", {
        "attempt_id": att["attempt_id"],
        "question_id": q["id"],
        "user_answer": "WRONG_ANSWER_123"
    }, token=token)
    print("=== INCORRECT SUBMIT ===")
    print(json.dumps(wrong, indent=2))
    
    # Correct
    ans = wrong.get("correct_answer")
    if ans:
        att2 = req("/attempts/start", "POST", {"activity_id": q["activity_id"]}, token=token)
        right = req("/attempts/submit", "POST", {
            "attempt_id": att2["attempt_id"],
            "question_id": q["id"],
            "user_answer": ans
        }, token=token)
        print("=== CORRECT SUBMIT ===")
        print(json.dumps(right, indent=2))
