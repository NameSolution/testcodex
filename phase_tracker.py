KEY = {
    2: ["music","movie","work","school","study","hobby"],
    3: ["cute","hot","sexy","kiss","flirt"],
    4: ["nude","pussy","boob","horny","dick","cock","hard"],
}
def detect(txt:str, mem):
    t = txt.lower()
    phase = mem.get("phase",1)
    for level, words in KEY.items():
        if any(w in t for w in words):
            phase = max(phase, level)
    if len(mem["history_pairs"]) >= 10 and phase < 5:
        phase = 5
    return phase
