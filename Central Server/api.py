import aiohttp
from fastapi import FastAPI, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import database

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4202"],
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
        raise HTTPException(
            404, detail="Мы уже набрали достаточное количество игроков для съёмок."
        )
    if username in blacklisted:
        raise HTTPException(404, detail="Данный аккаунт заблокирован навсегда.")
    if database.user_exists(username):
        raise HTTPException(404, detail="Данный аккаунт уже зарегестрирован.")

    data = await fetch_profile(username)

    if not data:
        raise HTTPException(404, detail="Такого аккаунта не существует.")

    database.whitelist(
        gd_account_id=data["accountID"],
        gd_username=data["username"],
        winner_role=username in winners,
    )

    return True


@app.get("/events")
async def _():
    return database.list_servers()


@app.get("/database")
async def _():
    users = database.get_all()
    if not users:
        raise HTTPException(404, "No users found")
    return users
