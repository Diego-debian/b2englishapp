
import urllib.request
import json
import urllib.parse
import time
import random
import math

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
u = f"audit_fixverify_{int(time.time())}"
req("/register", "POST", {"username": u, "email": f"{u}@test.com", "password": "password123"})
token_resp = req("/token", "POST", {"username": u, "password": "password123"}, content_type="application/x-www-form-urlencoded")
token = token_resp.get("access_token")

# 2. Setup Data
print("Fetching activities and pre-calculating question counts...")
activities = req("/activities", token=token)

# Enrich with question counts
act_q_counts = {}
act_q_ids = {} # map act_id -> list of q_ids

for a in activities:
    qs = req(f"/activities/{a['id']}/questions", token=token)
    act_q_counts[a['id']] = len(qs)
    act_q_ids[a['id']] = [q['id'] for q in qs]

# 3. Reimplements Frontend Logic exactly
sorted_acts = sorted(activities, key=lambda x: x.get("difficulty", 0))

third = math.ceil(len(sorted_acts) / 3)
low_band = sorted_acts[:third]
mid_band = sorted_acts[third:third*2]
high_band = sorted_acts[third*2:]

print(f"\n=== 2. VALIDACIÓN DE BANDAS ===")
print(f"Total Activities: {len(sorted_acts)}")
print(f"Low Band:  {len(low_band)} acts. (Non-empty: {len([a for a in low_band if act_q_counts[a['id']] > 0])})")
print(f"Mid Band:  {len(mid_band)} acts. (Non-empty: {len([a for a in mid_band if act_q_counts[a['id']] > 0])})")
print(f"High Band: {len(high_band)} acts. (Non-empty: {len([a for a in high_band if act_q_counts[a['id']] > 0])})")

# Check for bands with ONLY empty activities (Critical fail condition)
for name, band in [("Low", low_band), ("Mid", mid_band), ("High", high_band)]:
    non_empty = [a for a in band if act_q_counts[a['id']] > 0]
    if not non_empty:
        print(f"CRITICAL WARNING: {name} Band has NO non-empty activities!")

# 4. Run 10 Simulations
print(f"\n=== 1. LOG DE ACTIVIDADES (10 RUNS) ===")
print("Run | Warmup (ID) | Main (ID)   | Boss (ID)")
print("-" * 45)

total_unique_q_ids_seen = set()
repetition_count = 0 
runs_history = []

for i in range(10):
    # Logic from frontend
    w = random.choice(low_band) if low_band else sorted_acts[0]
    m = random.choice(mid_band) if mid_band else sorted_acts[len(sorted_acts)//2]
    b = random.choice(high_band) if high_band else sorted_acts[-1]
    
    runs_history.append((w['id'], m['id'], b['id']))
    
    print(f"{i+1:<3} | {w['id']:<11} | {m['id']:<11} | {b['id']:<11}")
    
    # Simulate picking questions (Slice 2/3/2)
    # Note: Simplification - assuming we just take first N like frontend does shuffle slice.
    # We will just take N random from the available IDs.
    
    # Warmup (2)
    pool_w = act_q_ids[w['id']]
    picked_w = random.sample(pool_w, min(2, len(pool_w)))
    
    # Main (3)
    pool_m = act_q_ids[m['id']]
    picked_m = random.sample(pool_m, min(3, len(pool_m)))
    
    # Boss (2)
    pool_b = act_q_ids[b['id']]
    picked_b = random.sample(pool_b, min(2, len(pool_b)))
    
    run_q_ids = picked_w + picked_m + picked_b
    
    for qid in run_q_ids:
        if qid in total_unique_q_ids_seen:
            repetition_count += 1
        total_unique_q_ids_seen.add(qid)

# 5. Evidence of Variety
print(f"\n=== 3. EVIDENCIA DE VARIEDAD REAL (10 RUNS) ===")
print(f"Total Unique Questions Seen: {len(total_unique_q_ids_seen)}")
# Total theoretically possible slots: 10 runs * (2+3+2) = 70 slots (approx, if pools allow)
# Repetitions is how many times we picked a Q that we had seen in a PREVIOUS run (or same run if duplicate, but sets handle that).
# Actually repetition_count calculated above tracks "collisions" across runs.

print(f"Questions Repetitions (Collisions): {repetition_count}")

# Check activity variation
unique_w = len(set(r[0] for r in runs_history))
unique_m = len(set(r[1] for r in runs_history))
unique_b = len(set(r[2] for r in runs_history))

print(f"\nUnique Activities Selected per Slot (out of 10 runs):")
print(f"Warmup: {unique_w} unique acts (Pool size: {len(low_band)})")
print(f"Main:   {unique_m} unique acts (Pool size: {len(mid_band)})")
print(f"Boss:   {unique_b} unique acts (Pool size: {len(high_band)})")

