
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

# Frontend Logic Simulation
def normalize_answer_simulate(val):
    if val is None: return ""
    # .trim().toLowerCase()...
    # .replace(/[\u0300-\u036f]/g, "") // Remove accents (simplified here)
    # .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "") // Remove punctuation
    # .replace(/\s{2,}/g, " ")
    
    val = val.strip().lower()
    # Simplified normalization for python simulation
    import re
    val = re.sub(r'[.,/#!$%^&*;:{}=\-_`~()]', '', val)
    val = re.sub(r'\s{2,}', ' ', val)
    return val

def frontend_submit_logic_simulate(kind, raw_answer):
    is_mcq = kind in ["choice", "mcq", "multiple_choice"]
    
    if is_mcq:
        final = raw_answer
        log_type = "RAW (MCQ)"
    else:
        final = normalize_answer_simulate(raw_answer)
        log_type = "NORMALIZED (Text)"
        
    print(f"   [Frontend Logic] Kind='{kind}' | Raw='{raw_answer}' -> Send='{final}' ({log_type})")
    return final

# 1. Setup
u = f"audit_fix_{int(time.time())}"
req("/register", "POST", {"username": u, "email": f"{u}@test.com", "password": "password123"})
token_resp = req("/token", "POST", {"username": u, "password": "password123"}, content_type="application/x-www-form-urlencoded")
token = token_resp.get("access_token")

# 2. Get Activities & Kinds
print("=== 2. KIND COVERAGE ===")
acts = req("/activities", token=token)
kinds_found = set()
questions_pool = []

for a in acts:
    qs = req(f"/activities/{a['id']}/questions", token=token)
    for q in qs:
        kinds_found.add(q["kind"])
        questions_pool.append(q)

print(f"Unique Kinds Found: {kinds_found}")

# 3. Tests
print("\n=== 3. MANUAL TESTS ===")

# Find MCQ
mcq = next((q for q in questions_pool if q["kind"] in ["multiple_choice", "mcq", "choice"]), None)

if mcq:
    print(f"\nA) MCQ TEST (ID: {mcq['id']})")
    print(f"   Prompt: {mcq['prompt']}")
    print(f"   Options: {mcq['options']}")
    
    # We need to know correct answer to verify 'correct' case.
    # In this seed, id=1, answer='goes' (BUT options are ["go", "goes", ...])
    # Case sensitive check: 'goes' matches 'goes'. 
    # Let's try 'goes'
    
    target_answer = "goes" # From previous audit we know this is correct for id 1
    if "goes" in mcq["options"]:
         target_answer = "goes"
    else:
         target_answer = mcq["options"][0] # Just pick one if 'goes' not found
         
    # Start attempt
    att = req("/attempts/start", "POST", {"activity_id": mcq["activity_id"]}, token=token)
    
    # Test 1: Correct (Case match)
    # Simulate user clicking 'goes'
    raw_input = target_answer 
    payload = frontend_submit_logic_simulate(mcq["kind"], raw_input)
    
    res = req("/attempts/submit", "POST", {
        "attempt_id": att["attempt_id"],
        "question_id": mcq["id"],
        "user_answer": payload
    }, token=token)
    print(f"   Backend Response: is_correct={res.get('is_correct')} | correct_ans={res.get('correct_answer')}")

    # Test 2: Incorrect
    raw_input_wrong = "WRONG_OPTION"
    payload_wrong = frontend_submit_logic_simulate(mcq["kind"], raw_input_wrong)
    
    res_wrong = req("/attempts/submit", "POST", {
        "attempt_id": att["attempt_id"],
        "question_id": mcq["id"],
        "user_answer": payload_wrong
    }, token=token)
    print(f"   Backend Response (Wrong): is_correct={res_wrong.get('is_correct')}")
    
    # Test 3: Edge Case Spaces in MCQ
    # If option was " goes " (hypothetically)
    # The frontend passes it exact.
    # Let's mimic an option that HAS spaces if one existed. 
    # Current options don't have trailing spaces. 
    # But let's verify if we send "goes " (simulating an option with space selected)
    # Backend SHOULD fail if it expects "goes".
    
    raw_input_space = "goes " 
    payload_space = frontend_submit_logic_simulate(mcq["kind"], raw_input_space) # Should be RAW 'goes '
    
    res_space = req("/attempts/submit", "POST", {
        "attempt_id": att["attempt_id"],
        "question_id": mcq["id"],
        "user_answer": payload_space
    }, token=token)
    print(f"   Backend Response (Space 'goes '): is_correct={res_space.get('is_correct')} (Expect False if strict)")


# Find Text (If any)
text_q = next((q for q in questions_pool if q["kind"] not in ["multiple_choice", "mcq", "choice"]), None)

if text_q:
    print(f"\nB) TEXT TEST (ID: {text_q['id']})")
    att_t = req("/attempts/start", "POST", {"activity_id": text_q["activity_id"]}, token=token)
    
    # Simulate user typing "  SoMe  TexT  "
    raw_input = "  My   Answer  "
    payload = frontend_submit_logic_simulate(text_q["kind"], raw_input) # Should be 'my answer'
    
    res = req("/attempts/submit", "POST", {
        "attempt_id": att_t["attempt_id"],
        "question_id": text_q["id"],
        "user_answer": payload
    }, token=token)
    print(f"   Backend Response: {res}")

else:
    print("\nB) TEXT TEST")
    print("   No text/input questions found in current seed.")
    print("   Simulating Logic only:")
    frontend_submit_logic_simulate("text", "  TESTing   Logic  ")

