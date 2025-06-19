import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

import reply_engine


def test_build_prompt():
    mem = {"history_pairs": [("hi", "hello") for _ in range(3)], "phase": 1}
    prompt = reply_engine.build_prompt("hey", mem["history_pairs"])
    assert "emy:" in prompt and "user:" in prompt
