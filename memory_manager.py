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
    if "history_pairs" not in data:
        data["history_pairs"] = []
    if "phase" not in data:
        data["phase"] = 1
    return data

def save(uid, data):
    with open(_p(uid), "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
