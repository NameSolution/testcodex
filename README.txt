============================================================
Emy Telegram GFE Bot + LLM (Ollama nous-hermes2)
============================================================

1. Prérequis
   - Python 3.11 installé et ajouté au PATH
   - Ollama installé : https://ollama.com
   - Dans PowerShell :
     winget install ollama.ollama
     ollama pull nous-hermes2:7b-dpo

2. Installer dépendances Python :
   py -3.11 -m pip install python-telegram-bot==20.7 requests

3. Configurer :
   - Ouvrir config.py
   - Mettre BOT_TOKEN = "VOTRE_TOKEN_TELEGRAM"

4. Lancer :
   py -3.11 telegram_bot.py

5. Fonctionnement :
   - Le bot écoute Telegram
   - Chaque message passe par phase_tracker → funnel
   - reply_engine appelle Ollama local (http://localhost:11434) avec le prompt persona
   - Phase 5 : drop du lien TG (t.me/ChadSolution)

Fichiers clés :
├─ config.py
├─ telegram_bot.py
├─ reply_engine.py
├─ phase_tracker.py
├─ memory_manager.py
├─ personas/Emy_FINAL_GFE_SMS_v7.7.json
└─ start.bat
