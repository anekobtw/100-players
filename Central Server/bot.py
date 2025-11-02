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
async def handle_request(data: RequestData) -> None:
    await bot.send_message(
        chat_id=1718021890,
        text=f"Request received from {data.admin_name} for user {data.user_id}",
    )



# --- Bot ---
router = Router()

class BotState:
    group_url = "https://t.me/+W90_vZ5EA-E2M2Qy"
    registration = False
    limit = 250
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
async def start(message: types.Message) -> None:
    kb = types.InlineKeyboardMarkup(inline_keyboard=[
        [
            types.InlineKeyboardButton(text="🎥  Учавствовать в видео", url='https://t.me/players_100_bot?text=/set%20твой_никнейм'),
            types.InlineKeyboardButton(text="✉  Обратная связь️", url="https://t.me/players_100_bot/?text=/support%20твой_вопрос"),
        ]
    ])

    await message.answer_photo(
        photo=types.FSInputFile("pfp.png"),
        caption="👋 <b>Привет! Спасибо, что захотел поучавствовать в видео!</b>\n\nПожалуйста, выбери одно из действий:",
        reply_markup=kb,
    )


        
@router.message(Command("set"))
async def _(message: types.Message) -> types.Message | None:
    nickname = message.text[5:]
    logging.info(f"Попытка регистрации от {nickname}")

    if not nickname:
        return await message.answer("❌ Укажи никнейм:\n<code>/set DimaNelis</code>")

    if not BotState.registration:
        return await message.answer("❌ Набор ещё не запущен.")

    if len(database.get_all()) >= BotState.limit:
        return await message.answer("❌ Мы набрали достаточно участников для съёмок.")

    if nickname in BotState.blacklisted:
        return await message.answer("❌ Этот аккаунт заблокирован навсегда.")

    data = await fetch_profile(nickname)
    if not data:
        await message.answer("❌ Аккаунт не найден. Проверьте правильность регистра.")
        return

    database.whitelist(
        gd_account_id=data["accountID"],
        gd_username=data["username"],
        is_winner=nickname.lower() in BotState.winners,
    )

    await message.answer(
        f"✅ Аккаунт успешно добавлен в вайтлист! Ожидайте будущих инструкций в группе.\n\n👉 Ссылка на группу: {BotState.group_url}\n\n<b>❗ ВАЖНО:</b> Успейте зайти на сервер до начала съёмок — после старта войти не сможет никто, даже из вайтлиста!"
    )


@router.message(Command("support"))
async def support(message: types.Message, command: Command) -> None:
    if not command.args:
        await message.answer("❌ Пожалуйста, введите сообщение после команды /support.")
        return

    kb = types.InlineKeyboardMarkup(inline_keyboard=[[types.InlineKeyboardButton(text="Ответить", url=f"https://t.me/players_100_bot?text=/reply%20{message.from_user.id}%20")]])

    await bot.send_message(
        chat_id=1718021890,
        text=f"Новое сообщение от <b>{message.from_user.full_name}</b> (@{message.from_user.username} | <code>{message.from_user.id}</code>):\n\n{command.args}",
        reply_markup=kb,
    )

    await message.answer("❤️ <b>Спасибо за ваше сообщение!</b> Мы обязательно рассмотрим его в ближайшее время.")


@router.message(F.from_user.id == 1718021890, Command("reply"))
async def _(message: types.Message, command: Command) -> None:
    user_id, *reply_text = command.args.split()

    await bot.send_message(
        chat_id=int(user_id),
        text=f"📩 <b>Ответ от администрации:</b>\n\n{" ".join(reply_text)}",
    )

    await message.answer("✅ Сообщение успешно отправлено пользователю.")


@router.message(F.from_user.id == 1718021890, Command("open"))
async def _(message: types.Message) -> None:
    BotState.registration = True
    await message.answer("Набор открыт!")


@router.message(F.from_user.id == 1718021890, Command("close"))
async def _(message: types.Message) -> None:
    BotState.registration = False
    await message.answer("Набор закрыт!")


async def start_bot() -> None:
    dp = Dispatcher(storage=MemoryStorage())
    dp.include_router(router)
    await dp.start_polling(bot)


async def start_api() -> None:
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
