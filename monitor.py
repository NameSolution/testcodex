import os
import tkinter as tk
from tkinter import ttk

from memory_manager import load
from config import MEMORY_DIR


def get_user_ids():
    ids = []
    for name in os.listdir(MEMORY_DIR):
        if name.endswith(".json"):
            ids.append(name[:-5])
    return ids


def refresh_ids():
    ids = get_user_ids()
    user_list.delete(0, tk.END)
    for uid in ids:
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


def main():
    global root, user_list, text

    root = tk.Tk()
    root.title("Bot Monitor")

    mainframe = ttk.Frame(root, padding=10)
    mainframe.grid(row=0, column=0, sticky="nsew")
    root.rowconfigure(0, weight=1)
    root.columnconfigure(0, weight=1)

    user_list = tk.Listbox(mainframe, width=20)
    user_list.grid(row=0, column=0, sticky="ns")
    user_list.bind("<<ListboxSelect>>", show_memory)

    refresh_btn = ttk.Button(mainframe, text="Refresh", command=refresh_ids)
    refresh_btn.grid(row=1, column=0, pady=5)

    text = tk.Text(mainframe, width=60)
    text.grid(row=0, column=1, rowspan=2, sticky="nsew", padx=(10, 0))
    text.configure(state="disabled")

    mainframe.rowconfigure(0, weight=1)
    mainframe.columnconfigure(1, weight=1)

    refresh_ids()
    root.mainloop()


if __name__ == "__main__":
    main()

