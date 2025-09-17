import asyncio
import json

import aiohttp
import uvicorn
from fastapi import FastAPI, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import database

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def fetch_profile(nickname: str) -> dict | None:
    url = f"https://gdbrowser.com/api/profile/{nickname}"
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            if resp.status != 200:
                return None
            return await resp.json()


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


@app.post("/login")
async def _(username: str = Form(...)):
    if len(database.get_all()) >= LIMIT:
        raise HTTPException(404, "Мы уже набрали достаточное количество игроков для съёмок.")
    if username in blacklisted:
        raise HTTPException(404, "Данный аккаунт заблокирован навсегда.")
    if database.user_exists(username):
        raise HTTPException(404, "Данный аккаунт уже зарегестрирован.")

    data = await fetch_profile(username)

    if not data:
        raise HTTPException(404, "Такого аккаунта не существует.")

    database.whitelist(
        gd_account_id=data["accountID"],
        gd_username=data["username"],
        winner_role=username in winners,
    )

    return True


@app.post("/run")
async def _():
    # I'm just leaving it here for now, it'll be secured later
    GAME_SERVER_FILE = "server/globed-game-server-x64"
    CENTRAL_SERVER_FILE = "server/globed-central-server.exe"

    with open("server/central-conf.json") as f:
        config = json.load(f)
        server_password = config["game_server_password"]
        ip = "http://" + config["game_servers"][0]["address"][:-1] + "1"

    await asyncio.create_subprocess_exec(CENTRAL_SERVER_FILE, cwd="../")
    await asyncio.sleep(3)
    await asyncio.create_subprocess_exec(GAME_SERVER_FILE, "0.0.0.0:4202", ip, server_password, cwd="../")


if __name__ == "__main__":
    config = uvicorn.Config(app, host="0.0.0.0", port=8000, log_level="debug")
    server = uvicorn.Server(config)
    asyncio.run(server.serve())
