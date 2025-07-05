import os
import json
from typing import Any, Dict

try:
    from config import MEMORY_DIR
except ImportError as e:
    raise ImportError("MEMORY_DIR not found in config.py") from e

os.makedirs(MEMORY_DIR, exist_ok=True)

def _p(uid: str) -> str:
    # Optional: sanitize uid to prevent directory traversal attacks
    safe_uid = "".join(c for c in uid if c.isalnum() or c in ('-', '_'))
    return os.path.join(MEMORY_DIR, f"{safe_uid}.json")

def load(uid: str) -> Dict[str, Any]:
    path = _p(uid)
    if os.path.exists(path):
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except (json.JSONDecodeError, OSError) as e:
            print(f"Error loading {path}: {e}")
            # Optionally log error or handle corrupted file
    return {"history_pairs": [], "phase": 1}

def save(uid: str, data: Dict[str, Any]) -> None:
    path = _p(uid)
    tmp_path = f"{path}.tmp"
    try:
        with open(tmp_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        os.replace(tmp_path, path)  # atomic save
    except OSError as e:
        print(f"Error saving {path}: {e}")
        # Optionally log error
