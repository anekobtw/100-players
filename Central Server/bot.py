import asyncio
import logging
import os

import aiohttp
import uvicorn
from aiogram import Bot, Dispatcher, F, Router, types
from aiogram.client.default import DefaultBotProperties
from aiogram.filters import Command, CommandStart
from aiogram.fsm.storage.memory import MemoryStorage
from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel

import database

# --- Config ---
load_dotenv()
logging.basicConfig(level=logging.INFO, format="[%(levelname)s]   %(message)s")
API_TOKEN = os.getenv("TOKEN")
bot = Bot(token=API_TOKEN, default=DefaultBotProperties(parse_mode="HTML"))



# --- API ---
app = FastAPI()

class RequestData(BaseModel):
    admin_name: str
    user_id: str


@app.post("/request")
async def handle_request(data: RequestData):
    await bot.send_message(
        chat_id=1718021890,
        text=f"Request received from {data.admin_name} for user {data.user_id}",
    )



# --- Bot ---
router = Router()

GROUP_URL = "https://t.me/+W90_vZ5EA-E2M2Qy"
REGISTER = False
LIMIT = 200
blacklisted = {"snownitt"}
winners = {
    "zolotro",
    "mrmatras",
    "spookyz228",
    "maskagd",
    "forty0ne",
}


async def fetch_profile(nickname: str) -> dict | None:
    url = f"https://gdbrowser.com/api/profile/{nickname}"
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            if resp.status != 200:
                return None
            return await resp.json()


@router.message(CommandStart())
async def start(message: types.Message):
    await message.answer(
        "Привет! Чтобы участвовать в видео, напиши команду:\n"
        "<code>/set твой_никнейм</code>"
    )


@router.message(Command("set"))
async def _(message: types.Message):
    nickname = message.text[5:]
    logging.info(f"Попытка регистрации от {nickname}")

    if not nickname:
        return await message.answer("❌ Укажи никнейм:\n<code>/set DimaNelis</code>")

    if not REGISTER:
        return await message.answer("❌ Набор ещё не запущен.")

    if len(database.get_all()) >= LIMIT:
        return await message.answer("❌ Мы набрали достаточно участников для съёмок.")

    if nickname in blacklisted:
        return await message.answer("❌ Этот аккаунт заблокирован навсегда.")

    data = await fetch_profile(nickname)
    if not data:
        await message.answer("❌ Аккаунт не найден. Проверьте правильность регистра.")
        return

    database.whitelist(
        gd_account_id=data["accountID"],
        gd_username=data["username"],
        is_winner=nickname.lower() in winners,
    )

    await message.answer(
        f"✅ Аккаунт успешно добавлен в вайтлист! Ожидайте будущих инструкций в группе.\n\n👉 Ссылка на группу: {GROUP_URL}\n\n<b>❗ ВАЖНО:</b> Успейте зайти на сервер до начала съёмок — после старта войти не сможет никто, даже из вайтлиста!"
    )


@router.message(F.from_user.id == 1718021890, Command("open"))
async def _(message: types.Message):
    global REGISTER
    REGISTER = True
    await message.answer("Набор открыт!")


@router.message(F.from_user.id == 1718021890, Command("close"))
async def _(message: types.Message):
    global REGISTER
    REGISTER = False
    await message.answer("Набор закрыт!")


async def start_bot():
    dp = Dispatcher(storage=MemoryStorage())
    dp.include_router(router)
    await dp.start_polling(bot)


async def start_api():
    config = uvicorn.Config(app, host="0.0.0.0", port=4200, loop="asyncio")
    server = uvicorn.Server(config)
    await server.serve()


async def main():
    await asyncio.gather(
        start_bot(),
        start_api(),
    )


if __name__ == "__main__":
    asyncio.run(main())
