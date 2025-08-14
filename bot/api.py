import asyncio

import database
import handlers
import uvicorn
from aiogram import Bot
from fastapi import FastAPI, Request

app = FastAPI()
client = None


@app.post("/send")
async def _(request: Request):
    data = await request.json()

    await client.send_message(
        chat_id=int(data.get("to")),
        text=f"<b>От: {data.get("from")}</b>\n\n{data.get("text")}",
    )

    return {"status": "success"}


@app.post("/group")
async def _(request: Request):
    data = await request.json()
    handlers.GROUP_URL = data.get("group_url", 0)
    return {"status": "success"}


@app.post("/limit")
async def _(request: Request):
    data = await request.json()
    handlers.LIMIT = int(data.get("limit", 0))
    return {"status": "success"}


@app.post("/reg")
async def _(request: Request):
    data = await request.json()
    handlers.REGISTER = data.get("register", False)
    return {"status": "success"}


@app.post("/unwhitelist")
async def _():
    database.unwhitelist_all()
    return {"status": "success"}


@app.post("/info")
async def _():
    return {
        "register": handlers.REGISTER,
        "limit": handlers.LIMIT,
        "database": database.get_all(),
    }


# Run server
async def start_api(bot: Bot):
    global client
    client = bot
    config = uvicorn.Config(app, host="0.0.0.0", port=2000, log_level="debug")
    server = uvicorn.Server(config)
    await server.serve()


if __name__ == "__main__":
    asyncio.run(start_api())
