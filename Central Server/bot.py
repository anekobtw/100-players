import asyncio
import os

from aiogram import Bot, Dispatcher, F, Router, types
from aiogram.client.default import DefaultBotProperties
from aiogram.filters import Command, CommandStart
from aiogram.fsm.storage.memory import MemoryStorage
from dotenv import load_dotenv
import aiohttp

import database

router = Router()

GROUP_URL = ""
REGISTER = False
LIMIT = 150
blacklisted = {"snownitt"}
winners = {
    "anekobtw",
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
    print(nickname)

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
        "✅ Аккаунт успешно добавлен в вайтлист! Ожидайте будущих инструкций в группе.\n\n👉 Ссылка на группу: {GROUP_URL}\n\n<b>❗ ВАЖНО:</b> Успейте зайти на сервер до начала съёмок — после старта войти не сможет никто, даже из вайтлиста!"
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


async def main():
    load_dotenv()
    API_TOKEN = os.getenv("TOKEN")

    bot = Bot(token=API_TOKEN, default=DefaultBotProperties(parse_mode="HTML"))
    dp = Dispatcher(storage=MemoryStorage())
    dp.include_router(router)

    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
