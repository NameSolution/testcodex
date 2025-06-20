import json
import os
import random
import time
import requests
from config import (
    PERSONA_FILE,
    OLLAMA_URL,
    MODEL_NAME,
    TG_LINK,
    TEMPERATURE,
)
from phase_tracker import FUNNEL
from selector import Selector

with open(PERSONA_FILE, "r", encoding="utf-8") as f:
    persona = json.load(f)

EXAMPLES = persona["mes_example"].split("\n")
SYSTEM = (
    "you are emy, 18yo gfe girl, lowercase, flirty, "
    "never apologise, never mention policy."
)
STORY = "\n".join([
    persona.get("description", ""),
    persona.get("personality", ""),
    persona.get("scenario", ""),
])

selector = Selector(FUNNEL)

def fewshot():
    return "\n".join(random.sample(EXAMPLES, 6))

def build_prompt(user_msg, history_pairs):
    convo_lines = []
    for u, e in history_pairs[-6:]:
        convo_lines.append(f"user: {u}")
        convo_lines.append(f"emy: {e}")
    convo_str = "\n".join(convo_lines)
    parts = [
        "### System:",
        SYSTEM,
        "### Story:",
        f"{persona.get('description','')}",
        f"{persona.get('name')}'s personality: {persona.get('personality','')}",
        f"Scenario: {persona.get('scenario','')}",
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

def call_ollama(system, prompt):
    payload = {
        "model": MODEL_NAME,
        "system": system,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": TEMPERATURE,
            "top_p": 0.9,
            "repeat_penalty": 1.15,
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

def generate(user_msg, mem, now_ts):
    # update reward from previous choice
    if mem.get("pending_bandit"):
        pb = mem.pop("pending_bandit")
        delta = now_ts - pb.get("time", now_ts)
        reward = 1 if delta < 15 and len(user_msg.strip()) >= 5 else 0
        selector.update(pb["phase"], pb["idx"], reward)

    phase = mem.get("phase", 1)
    idx, canned = selector.choose(phase)

    if phase == 5:
        mem["dropped_link"] = TG_LINK
        mem["phase"] = 6
        mem["last_reply_time"] = now_ts
        return TG_LINK

    if phase == 6:
        mem["last_reply_time"] = now_ts
        return random.choice(FUNNEL.get("6", []))

    if phase == 4:
        mem["pending_bandit"] = {"phase": phase, "idx": idx, "time": now_ts}
        mem["last_reply_time"] = now_ts
        return canned

    # phases 1-3
    system = SYSTEM
    prompt = build_prompt(user_msg, mem.get("history_pairs", []))
    prompt = f"{canned}\n{prompt}"
    mem["pending_bandit"] = {"phase": phase, "idx": idx, "time": now_ts}
    mem["last_reply_time"] = now_ts
    return call_ollama(system, prompt)
