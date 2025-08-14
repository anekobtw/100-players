import asyncio
import json
import logging

import api
import handlers
from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.fsm.storage.memory import MemoryStorage

logging.basicConfig(level=logging.INFO, format="[%(levelname)s] %(message)s")

bot = Bot(token="7547755889:AAF_y0gAfnTlhtSyqLTATTJbk8K-rhID0Go", default=DefaultBotProperties(parse_mode="HTML"))


async def run_bot():
    dp = Dispatcher(storage=MemoryStorage())
    dp.include_router(handlers.router)
    await dp.start_polling(bot)


async def run_servers():
    GAME_SERVER_FILE = "../globed-game-server.exe"
    CENTRAL_SERVER_FILE = "../globed-central-server.exe"

    with open("../central-conf.json") as f:
        config = json.load(f)
        server_password = config["game_server_password"]
        ip = "http://" + config["game_servers"][0]["address"][:-1] + "1"

    await asyncio.create_subprocess_exec(CENTRAL_SERVER_FILE, cwd="../")
    await asyncio.sleep(3)
    await asyncio.create_subprocess_exec(GAME_SERVER_FILE, "0.0.0.0:4202", ip, server_password, cwd="../")


async def run_api():
    await api.start_api(bot)


async def main():
    await asyncio.gather(run_bot(), run_api(), run_servers())


if __name__ == "__main__":
    asyncio.run(main())
