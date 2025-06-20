# Emy Telegram Bot

Simple Telegram girlfriend experience bot powered by a local Ollama model.

## Setup
1. Install Python 3.11 and run `setup.bat` to install dependencies and the model.
2. Launch `start.bat` which opens the GUI.
3. Enter your Telegram bot token, adjust the model name or temperature if needed and hit **Save**.
4. Use **Start Bot** to begin polling Telegram. **Stop Bot** stops it.
5. **Monitor Memory** lets you inspect stored conversations. **Reset Learning** clears the bandit scores.
6. A status line shows the latest reply along with phase, profile and average score.

## How it works
- Incoming messages are checked by `phase_tracker.detect` to move through phases 1‑5 (see `gfe_phases.md`).
- At phase 5 the bot stops generating with the LLM and just sends the TG link.
- Otherwise `reply_engine.generate` builds a SillyTavern style prompt and calls Ollama.
- User data is stored in `user_memory/<id>.json` via `memory_manager`.

## Files
- `config.py` – editable settings
- `telegram_bot.py` – main bot logic
- `reply_engine.py` – builds prompts and calls Ollama
- `phase_tracker.py` – detects conversation phase
- `memory_manager.py` – load/save user memory
- `gui.py` – control panel and monitor
- `setup.bat`, `start.bat`
- `personas/Emy_FINAL_GFE_SMS_v7.7.json`
- `gfe_phases.md` – details about each funnel phase
