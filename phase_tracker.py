import json
import os
from config import AUTO_LIMIT

FUNNEL_PATH = os.path.join(os.path.dirname(__file__), "funnel.json")
with open(FUNNEL_PATH, "r", encoding="utf-8") as f:
    FUNNEL = json.load(f)

KEY = {
    2: ["work", "school", "hobby"],
    3: ["cute", "sexy", "kiss", "hot"],
    4: ["nude", "horny", "dick", "pussy", "cock"],
}

PROFILE_WORDS = {
    "horny": ["pic", "nude", "pussy", "dick"],
    "attracted": ["love", "miss u", "😍"],
}


def detect(txt: str, mem):
    t = txt.lower()
    phase = mem.get("phase", 1)
    history = mem.get("history_pairs", [])

    # profile detection
    profile = mem.get("profile", "curious")
    for p, words in PROFILE_WORDS.items():
        if any(w in t for w in words):
            profile = p
            break
    mem["profile"] = profile

    if phase < 2 and (len(history) >= 2 or any(w in t for w in KEY[2])):
        phase = 2
    if any(w in t for w in KEY[3]):
        phase = max(phase, 3)
    if any(w in t for w in KEY[4]):
        phase = max(phase, 4)

    if (len(history) >= AUTO_LIMIT and profile == "horny") or any(w in t for w in KEY[4]):
        phase = max(phase, 5)

    mem["phase"] = phase
    return phase
