@echo off
REM Install Python dependencies and Ollama model
py -3.11 -m pip install --upgrade pip
py -3.11 -m pip install python-telegram-bot==20.7 requests
if not exist "%USERPROFILE%\AppData\Local\Programs\Ollama" (
    winget install ollama.ollama
)
ollama pull dolphin-mixtral

