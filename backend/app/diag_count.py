
import urllib.request
import json
import urllib.parse
import time
from collections import defaultdict

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
u = f"audit_count_{int(time.time())}"
req("/register", "POST", {"username": u, "email": f"{u}@test.com", "password": "password123"})
token_resp = req("/token", "POST", {"username": u, "password": "password123"}, content_type="application/x-www-form-urlencoded")
token = token_resp.get("access_token")

# 2. Fetch Data
print("Fetching activities...")
activities = req("/activities", token=token)

total_questions = 0
kind_counts = defaultdict(int)
activity_stats = []

print(f"Found {len(activities)} activities. Scanning questions...")

for act in activities:
    qs = req(f"/activities/{act['id']}/questions", token=token)
    
    q_count = len(qs)
    total_questions += q_count
    
    kinds = set()
    sort_orders = []
    
    for q in qs:
        k = q.get("kind", "unknown")
        kind_counts[k] += 1
        kinds.add(k)
        sort_orders.append(q.get("sort_order", 0))
    
    min_sort = min(sort_orders) if sort_orders else 0
    max_sort = max(sort_orders) if sort_orders else 0
    
    activity_stats.append({
        "id": act["id"],
        "title": act.get("title", f"Activity {act['id']}"),
        "count": q_count,
        "kinds": list(kinds),
        "min_sort": min_sort,
        "max_sort": max_sort
    })

# 3. Report Generation

print("\n" + "="*50)
print("1) CONTEO GLOBAL")
print("="*50)
print(f"Total de preguntas en BD: {total_questions}")
print(f"Total de actividades: {len(activities)}")
print("Total de preguntas por kind:")
for k, v in kind_counts.items():
    print(f"  - {k}: {v}")

print("\n" + "="*50)
print("2) CONTEO POR ACTIVIDAD")
print("="*50)
print(f"{'ID':<5} | {'Title':<40} | {'Count':<6} | {'Kinds':<30} | {'Min':<4} | {'Max':<4}")
print("-" * 105)
for s in activity_stats:
    kinds_str = ", ".join(s["kinds"])[:30]
    print(f"{s['id']:<5} | {s['title']:<40} | {s['count']:<6} | {kinds_str:<30} | {s['min_sort']:<4} | {s['max_sort']:<4}")

print("\n" + "="*50)
print("3) DISTRIBUCIÓN ÚTIL")
print("="*50)

# Top 10
sorted_by_count = sorted(activity_stats, key=lambda x: x["count"], reverse=True)
print("Top 10 Actividades con más preguntas:")
for s in sorted_by_count[:10]:
     print(f"  - [{s['id']}] {s['title']}: {s['count']}")

# Empty
empty_acts = [s for s in activity_stats if s["count"] == 0]
if empty_acts:
    print(f"\nActividades con 0 preguntas: {len(empty_acts)}")
    for s in empty_acts:
        print(f"  - [{s['id']}] {s['title']}")
else:
    print("\nNo hay actividades vacías.")

# % Kind
print("\n% de preguntas por kind:")
if total_questions > 0:
    for k, v in kind_counts.items():
        pct = (v / total_questions) * 100
        print(f"  - {k}: {pct:.1f}%")

print("\n" + "="*50)
print("4) MÉTODO USADO")
print("="*50)
print("B) Llamadas GET /activities y GET /activities/{id}/questions (audit script)")
