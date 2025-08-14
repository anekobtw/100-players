import aiohttp
import database
from aiogram import Router, types
from aiogram.filters import Command, CommandObject, CommandStart

router = Router()

# --- Config ---
GROUP_URL = ""
REGISTER = False
LIMIT = 0
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


# --- Commands ---
@router.message(CommandStart())
async def start(message: types.Message):
    await message.answer("Привет! Чтобы участвовать в видео, напиши команду:\n" "<code>/set твой_никнейм</code>\n\n" "Если есть какой-либо вопрос, или проблема:\n" "<code>/support описание_проблемы</code>")


@router.message(Command("set"))
async def _(message: types.Message, command: CommandObject):
    nickname = command.args.strip() if command.args else None

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
        is_winner=command.args.lower() in winners,
    )

    await message.answer("✅ Аккаунт успешно добавлен в вайтлист! Ожидайте будущих инструкций в группе.\n\n👉 Ссылка на группу: {GROUP_URL}\n\n<b>❗ ВАЖНО:</b> Успейте зайти на сервер до начала съёмок — после старта войти не сможет никто, даже из вайтлиста!")


@router.message(Command("support"))
async def _(message: types.Message, command: CommandObject):
    if not command.args:
        await message.answer("❌ Пожалуйста, укажите вашу проблему.")
        return

    text = f"<b>От: @{message.from_user.username}</b> (<code>{message.from_user.id}</code>)\n\n{command.args}"

    await message.bot.send_message(chat_id=1718021890, text=text)
