import logging, asyncio
from config import BOT_TOKEN
from memory_manager import load, save
from phase_tracker import detect
from reply_engine import generate
from telegram.ext import ApplicationBuilder, MessageHandler, filters

logging.basicConfig(level=logging.INFO)

async def handle(update, context):
    uid = str(update.effective_user.id)
    msg = update.message.text or ""
    mem = load(uid)
    mem["phase"] = detect(msg, mem)
    now_ts = update.message.date.timestamp()
    reply = generate(msg, mem, now_ts)
    mem["history_pairs"].append((msg, reply))
    save(uid, mem)
    await update.message.reply_text(reply)

if __name__ == "__main__":
    app = ApplicationBuilder().token(BOT_TOKEN).build()
    app.add_handler(MessageHandler(filters.TEXT & (~filters.COMMAND), handle))
    app.run_polling()
