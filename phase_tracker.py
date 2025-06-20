from config import AUTO_LIMIT

KEY = {
    2: ["work", "school", "hobby"],
    3: ["cute", "sexy", "kiss", "hot"],
    4: ["nude", "horny", "dick", "pussy", "cock"],
}


def detect(txt: str, mem):
    t = txt.lower()
    phase = mem.get("phase", 1)
    history = mem.get("history_pairs", [])
    turns = len(history) + 1

    # simple profile heuristic
    if ("pic" in t or "photo" in t) and turns < 15:
        mem["profile"] = "horny"

    if phase < 2 and (turns >= 2 or any(w in t for w in KEY[2])):
        phase = 2
    if any(w in t for w in KEY[3]):
        phase = max(phase, 3)
    if any(w in t for w in KEY[4]):
        phase = max(phase, 4)

    if turns >= AUTO_LIMIT or mem.get("profile") == "horny":
        phase = max(phase, 5)

    mem["phase"] = phase
    return phase
