
import urllib.request
import json
import urllib.parse
import time
import random
from datetime import datetime, timedelta

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
u = f"audit_rep_{int(time.time())}"
req("/register", "POST", {"username": u, "email": f"{u}@test.com", "password": "password123"})
token_resp = req("/token", "POST", {"username": u, "password": "password123"}, content_type="application/x-www-form-urlencoded")
token = token_resp.get("access_token")

# 2. Simulate CLASSIC Logic
print("=== DIAGNOSTICO: CLASSIC MODE LOGIC ===")
activities = req("/activities", token=token)

# Step A: Sort by dificulty (Frontend: a.difficulty - b.difficulty)
# Backend doesn't return difficulty? Let's check keys.
# Actually previous log showed keys: id, tense_id, type... wait, schema says 'difficulty'
# Let's assume it has it.
sorted_acts = sorted(activities, key=lambda x: x.get("difficulty", 0))

if not sorted_acts:
    print("FATAL: No activities found.")
    exit()

warmup_act = sorted_acts[0]
main_act = sorted_acts[len(sorted_acts)//2]
boss_act = sorted_acts[-1]

print(f"1. Selected Activities (Fixed by Sort):")
print(f"   - Warmup: [{warmup_act['id']}] {warmup_act.get('title')} (Diff: {warmup_act.get('difficulty')})")
print(f"   - Main:   [{main_act['id']}] {main_act.get('title')} (Diff: {main_act.get('difficulty')})")
print(f"   - Boss:   [{boss_act['id']}] {boss_act.get('title')} (Diff: {boss_act.get('difficulty')})")

# Step B: Fetch Pools
print("\n2. Fetching & Slicing:")
modes = [
    ("Warmup", warmup_act, 2),
    ("Main", main_act, 3),
    ("Boss", boss_act, 2)
]

total_selected = []
pool_stats = []

for name, act, slice_size in modes:
    qs = req(f"/activities/{act['id']}/questions", token=token)
    
    # Filter Recent (Simulated empty for new user)
    # Shuffle (Random sample)
    final_pool = qs # No history filtering for new user
    
    if len(final_pool) >= slice_size:
        selected = random.sample(final_pool, slice_size)
    else:
        selected = final_pool
    
    selected_ids = [q['id'] for q in selected]
    total_ids = [q['id'] for q in qs]
    
    print(f"   - {name} [{act['title']}]:")
    print(f"     Pool Total: {len(qs)}")
    print(f"     Slice Size: {slice_size}")
    print(f"     Selection: {len(selected)}/{len(qs)} (used {int(len(selected)/len(qs)*100) if len(qs)>0 else 0}%)")
    print(f"     IDs Available: {total_ids}")
    print(f"     IDs Selected:  {selected_ids}")
    
    pool_stats.append({
        "name": name,
        "total": len(qs),
        "selected": len(selected)
    })

print("\n=== CONCLUSIÓN PRELIMINAR ===")
print("Actividades usadas siempre:")
print(f"   1. {warmup_act['title']}")
print(f"   2. {main_act['title']}")
print(f"   3. {boss_act['title']}")
print("Si estas actividades tienen pocos items, la repetición es inevitable.")

# Check for 0 questions
zeros = [x for x in pool_stats if x['total'] == 0]
if zeros:
    print(f"\nCRÍTICO: {len(zeros)} de las 3 actividades seleccionadas tienen 0 preguntas.")
    for z in zeros:
        print(f"   - {z['name']} tiene 0 preguntas.")

