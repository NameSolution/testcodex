import os
import sys
import subprocess
import tkinter as tk
from tkinter import ttk, messagebox

import config
from memory_manager import load
from selector import Selector
from phase_tracker import FUNNEL

selector = Selector(FUNNEL)

bot_process = None


def save_config():
    try:
        temp = float(temp_var.get())
    except ValueError:
        messagebox.showerror("Error", "Temperature must be a number")
        return
    cfg_lines = [
        f'BOT_TOKEN = "{token_var.get().strip()}"',
        'TG_LINK = "t.me/ChadSolution"',
        'PERSONA_FILE = "personas/Emy_FINAL_GFE_SMS_v7.7.json"',
        'OLLAMA_URL = "http://localhost:11434/api/generate"',
        f'MODEL_NAME = "{model_var.get().strip() or "dolphin-phi:2.7b"}"',
        f'TEMPERATURE = {temp}',
        f'AUTO_LIMIT = {auto_var.get().strip() or 25}',
        'MEMORY_DIR = "user_memory"',
    ]
    with open('config.py', 'w', encoding='utf-8') as f:
        f.write("\n".join(cfg_lines) + "\n")
    messagebox.showinfo("Saved", "Configuration saved")


def start_bot():
    global bot_process
    if bot_process and bot_process.poll() is None:
        messagebox.showinfo("Info", "Bot already running")
        return
    bot_process = subprocess.Popen([sys.executable, 'telegram_bot.py'])
    messagebox.showinfo("Info", "Bot started")


def stop_bot():
    global bot_process
    if bot_process and bot_process.poll() is None:
        bot_process.terminate()
        bot_process.wait(5)
        messagebox.showinfo("Info", "Bot stopped")
    else:
        messagebox.showinfo("Info", "Bot is not running")


def reset_learning():
    if messagebox.askyesno("Reset", "Reset bandit learning?"):
        selector.reset()
        messagebox.showinfo("Reset", "Learning reset")


def open_monitor():
    from monitor import get_user_ids
    win = tk.Toplevel(root)
    win.title("Memory Monitor")

    frame = ttk.Frame(win, padding=10)
    frame.grid(row=0, column=0, sticky="nsew")
    win.rowconfigure(0, weight=1)
    win.columnconfigure(0, weight=1)

    user_list = tk.Listbox(frame, width=20)
    user_list.grid(row=0, column=0, sticky="ns")

    text = tk.Text(frame, width=60)
    text.grid(row=0, column=1, rowspan=2, sticky="nsew", padx=(10, 0))
    text.configure(state="disabled")

    def refresh_ids():
        user_list.delete(0, tk.END)
        for uid in get_user_ids():
            user_list.insert(tk.END, uid)

    def show_memory(event=None):
        if not user_list.curselection():
            return
        uid = user_list.get(user_list.curselection())
        data = load(uid)
        text.configure(state="normal")
        text.delete("1.0", tk.END)
        text.insert(tk.END, f"User: {uid}\nPhase: {data.get('phase')}\n\n")
        for u, e in data.get("history_pairs", []):
            text.insert(tk.END, f"user: {u}\nemy: {e}\n\n")
        text.configure(state="disabled")

    user_list.bind("<<ListboxSelect>>", show_memory)

    refresh_btn = ttk.Button(frame, text="Refresh", command=refresh_ids)
    refresh_btn.grid(row=1, column=0, pady=5)

    frame.rowconfigure(0, weight=1)
    frame.columnconfigure(1, weight=1)

    refresh_ids()

# GUI setup
root = tk.Tk()
root.title("Emy Bot Controller")

main = ttk.Frame(root, padding=10)
main.grid(row=0, column=0, sticky="nsew")
root.rowconfigure(0, weight=1)
root.columnconfigure(0, weight=1)

# Fields
ttk.Label(main, text="Bot Token:").grid(row=0, column=0, sticky="e")

token_var = tk.StringVar(value=config.BOT_TOKEN)
token_entry = ttk.Entry(main, width=40, textvariable=token_var)
token_entry.grid(row=0, column=1, sticky="ew")

ttk.Label(main, text="Model Name:").grid(row=1, column=0, sticky="e")
model_var = tk.StringVar(value=config.MODEL_NAME)
model_menu = ttk.OptionMenu(main, model_var, model_var.get(), "dolphin-phi:2.7b", "dolphin-mixtral")
model_menu.grid(row=1, column=1, sticky="ew")

ttk.Label(main, text="Temperature:").grid(row=2, column=0, sticky="e")
temp_var = tk.StringVar(value=str(config.TEMPERATURE))
temp_entry = ttk.Entry(main, width=10, textvariable=temp_var)
temp_entry.grid(row=2, column=1, sticky="w")

ttk.Label(main, text="Auto-limit:").grid(row=3, column=0, sticky="e")
auto_var = tk.StringVar(value=str(getattr(config, "AUTO_LIMIT", 25)))
auto_entry = ttk.Entry(main, width=10, textvariable=auto_var)
auto_entry.grid(row=3, column=1, sticky="w")

# Buttons
btn_frame = ttk.Frame(main)
btn_frame.grid(row=4, column=0, columnspan=2, pady=10)

save_btn = ttk.Button(btn_frame, text="Save", command=save_config)
save_btn.grid(row=0, column=0, padx=5)

start_btn = ttk.Button(btn_frame, text="Start Bot", command=start_bot)
start_btn.grid(row=0, column=1, padx=5)

stop_btn = ttk.Button(btn_frame, text="Stop Bot", command=stop_bot)
stop_btn.grid(row=0, column=2, padx=5)

reset_btn = ttk.Button(btn_frame, text="Reset Learning", command=reset_learning)
reset_btn.grid(row=0, column=3, padx=5)

monitor_btn = ttk.Button(btn_frame, text="Monitor Memory", command=open_monitor)
monitor_btn.grid(row=0, column=4, padx=5)

main.columnconfigure(1, weight=1)

status_var = tk.StringVar(value="No data")
status_label = ttk.Label(main, textvariable=status_var, justify="left")
status_label.grid(row=5, column=0, columnspan=2, sticky="w")


def update_status():
    try:
        files = [
            os.path.join(config.MEMORY_DIR, f)
            for f in os.listdir(config.MEMORY_DIR)
            if f.endswith(".json")
        ]
        if not files:
            status_var.set("No conversations yet")
        else:
            latest = max(files, key=os.path.getmtime)
            uid = os.path.splitext(os.path.basename(latest))[0]
            data = load(uid)
            phase = data.get("phase")
            profile = data.get("profile")
            last = data.get("history_pairs", [])[-1][1] if data.get("history_pairs") else ""
            score = selector.average_score()
            status_var.set(
                f"User {uid}: phase {phase}, profile {profile}, score {score:.2f}\nLast: {last}"
            )
    except Exception as exc:
        status_var.set(str(exc))
    root.after(5000, update_status)

update_status()
root.mainloop()

