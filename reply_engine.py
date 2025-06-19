import json, requests, textwrap, random
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
SYSTEM = persona["data"]["system_prompt"]
STORY = "\n".join([
    persona.get("description", ""),
    persona.get("personality", ""),
    persona.get("scenario", ""),
])

def fewshot():
    return "\n".join([f"emy: {l}" for l in random.sample(EXAMPLES, 6)])

def build_prompt(user_msg, history_pairs):
    convo_lines = [f"user: {u}\nemy: {e}" for u, e in history_pairs[-6:]]
    convo_str = "\n".join(convo_lines)
    sys_json = json.dumps({"system": SYSTEM}, ensure_ascii=False)
    prompt = "\n".join(
        [
            sys_json,
            STORY,
            "",
            fewshot(),
            "",
            convo_str,
            "### Instruction:",
            user_msg,
            "",
            "### Response:",
        ]
    )
    return prompt

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
    r = requests.post(OLLAMA_URL, json=payload, timeout=90)
    r.raise_for_status()
    text = r.json()["response"].strip()
    return text.split("</s>")[0].strip()

def generate(user_msg, mem):
    phase = mem["phase"]
    if phase == 5 and TG_LINK not in user_msg.lower():
        return f"ok. u reached phase 5 😈 link 👉 {TG_LINK}"
    prompt = build_prompt(user_msg, mem["history_pairs"])
    response = call_ollama(prompt)
    return response
