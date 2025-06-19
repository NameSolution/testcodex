import os, json
from config import MEMORY_DIR
os.makedirs(MEMORY_DIR, exist_ok=True)

def _p(uid): return os.path.join(MEMORY_DIR, f"{uid}.json")

def load(uid):
    if os.path.exists(_p(uid)):
        with open(_p(uid), "r", encoding="utf-8") as f:
            return json.load(f)
    return {"history_pairs": [], "phase": 1}

def save(uid, data):
    with open(_p(uid), "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
