import os, json
from config import MEMORY_DIR
os.makedirs(MEMORY_DIR, exist_ok=True)

def _p(uid): return os.path.join(MEMORY_DIR, f"{uid}.json")

def load(uid):
    data = {}
    if os.path.exists(_p(uid)):
        with open(_p(uid), "r", encoding="utf-8") as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError:
                data = {}
    data.setdefault("history_pairs", [])
    data.setdefault("phase", 1)
    data.setdefault("profile", "curious")
    data.setdefault("dropped_link", False)
    return data

def save(uid, data):
    with open(_p(uid), "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
