import json
import random
import requests
from config import (
    PERSONA_FILE,
    OLLAMA_URL,
    MODEL_NAME,
    TG_LINK,
    TEMPERATURE,
)

with open(PERSONA_FILE, "r", encoding="utf-8") as f:
    persona = json.load(f)

EXAMPLES = persona["mes_example"].split("\n")
SYSTEM = "you are emy, 18 yo snapchat girl, flirty, lowercase, gfe, never apologise, never mention policy, never call yourself assistant"
STORY = "\n".join([
    persona.get("description", ""),
    persona.get("personality", ""),
    persona.get("scenario", ""),
])

def fewshot():
    return "\n".join(random.sample(EXAMPLES, 6))

def build_prompt(user_msg, history_pairs):
    convo_lines = []
    for u, e in history_pairs[-6:]:
        convo_lines.append(f"user: {u}")
        convo_lines.append(f"emy: {e}")
    convo_str = "\n".join(convo_lines)
    sys_json = json.dumps({"system": SYSTEM}, ensure_ascii=False)
    parts = [
        sys_json,
        STORY,
        "***",
        fewshot(),
        "***",
        convo_str,
        "### Instruction:",
        user_msg,
        "",
        "### Response:",
    ]
    return "\n".join(parts)

def call_ollama(prompt):
    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": TEMPERATURE,
            "top_p": 0.9,
            "repeat_penalty": 1.1,
        },
    }
    try:
        r = requests.post(OLLAMA_URL, json=payload, timeout=90)
        r.raise_for_status()
    except requests.HTTPError as e:
        if e.response is not None and e.response.status_code == 404:
            return "LLM offline"
        return "network glitch, try again"
    except requests.RequestException:
        return "network glitch, try again"
    text = r.json().get("response", "").strip()
    return text.split("</s>")[0].strip()

def generate(user_msg, mem):
    phase = mem["phase"]
    if phase == 5 and TG_LINK not in mem.get("dropped_link", ""):
        mem["dropped_link"] = TG_LINK
        return f"ok. u reached phase 5 \ud83d\ude08 link \ud83d\udc49 {TG_LINK}"
    prompt = build_prompt(user_msg, mem["history_pairs"])
    response = call_ollama(prompt)
    return response
