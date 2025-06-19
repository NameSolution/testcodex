import json, requests, textwrap, random
from config import PERSONA_FILE, OLLAMA_URL, MODEL_NAME, TG_LINK

with open(PERSONA_FILE, "r", encoding="utf-8") as f:
    persona = json.load(f)

EXAMPLES = persona["mes_example"].split("\n")
SYSTEM = persona["data"]["system_prompt"]

def fewshot():
    return "\n".join([f"emy: {l}" for l in random.sample(EXAMPLES, 6)])

def build_prompt(user_msg, history_pairs):
    convo_lines = []
    for u, e in history_pairs[-6:]:
        convo_lines.append(f"user: {u}")
        convo_lines.append(f"emy: {e}")
    convo_lines.append(f"user: {user_msg}")
    convo_str = "\n".join(convo_lines)

    prompt = textwrap.dedent(
        f"""
        <s>[INST] <<SYS>>
        {SYSTEM}
        <</SYS>>

        {fewshot()}
        {convo_str}
        emy: [/INST]
    """
    ).strip()
    return prompt

def call_ollama(prompt):
    payload = {"model": MODEL_NAME,
               "prompt": prompt,
               "stream": False,
               "options": {"temperature": 0.7}}
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
