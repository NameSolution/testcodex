@echo off
REM Install Python dependencies and Ollama model
py -3.11 -m pip install --upgrade pip
py -3.11 -m pip install python-telegram-bot==20.7 requests
if not exist "%USERPROFILE%\AppData\Local\Programs\Ollama" (
    winget install ollama.ollama
)
for /f "delims=" %%M in ('py -3.11 -c "import config,sys;print(config.MODEL_NAME)"') do set MODEL=%%M
ollama pull %MODEL%

