
import sys
import json
import urllib.request
import urllib.parse
import random
import time

BASE_URL = "http://localhost:8001"

def req(path, method="GET", json_data=None, token=None):
    url = f"{BASE_URL}{path}"
    headers = {}
    if json_data is not None:
        headers["Content-Type"] = "application/json"
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    body = None
    if json_data:
        body = json.dumps(json_data).encode("utf-8")
            
    request = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request) as res:
            resp_data = res.read().decode("utf-8")
            return json.loads(resp_data)
    except urllib.error.HTTPError as e:
        print(f"HTTPError {path}: {e.code} {e.reason}")
        print(e.read().decode("utf-8"))
        return None
    except Exception as e:
        print(f"Exception {path}: {e}")
        return None

def run():
    print("Checking Health...")
    health = req("/health")
    print(f"Health: {health}")
    
    suffix = random.randint(1000,9999)
    username = f"validuser{suffix}"
    email = f"valid{suffix}@example.com"
    password = "password123"

    print(f"Registering user {username}...")
    reg = req("/register", "POST", {"username": username, "email": email, "password": password})
    if not reg:
        print("Registration failed. Trying login with existing potential user (dev/dev)?")
        username="dev" 
        password="dev"
    else:
        print("Registered OK")

    print(f"Logging in as {username}...")
    token = None
    try:
        login_data = {"username": username, "password": password}
        body = urllib.parse.urlencode(login_data).encode("utf-8")
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        r = urllib.request.Request(f"{BASE_URL}/token", data=body, headers=headers, method="POST")
        with urllib.request.urlopen(r) as res:
            token_resp = json.loads(res.read().decode("utf-8"))
            token = token_resp["access_token"]
            print("Got Token OK")
    except Exception as e:
        print(f"Login failed: {e}")
        return

    print("Initializing Progress (POST /progress/init)...")
    init_res = req("/progress/init", "POST", {}, token=token)
    print(f"Init Result: {init_res}")

    print("Getting Progress (GET /progress)...")
    progress_res = req("/progress", "GET", token=token)
    
    if isinstance(progress_res, list):
        print(f"SUCCESS: Received list of {len(progress_res)} items.")
        if len(progress_res) > 0:
            print(f"First item: {progress_res[0]}")
    else:
        print(f"FAILURE: Unexpected response shape: {type(progress_res)}")
        print(progress_res)

if __name__ == "__main__":
    try:
        run()
    except Exception as e:
        print(f"Script crash: {e}")
