import asyncio
import random
import time

import aiohttp
import uvicorn
from fastapi import FastAPI, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
pending_codes = {}

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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


@app.post("/login")
async def _(username: str = Form(...)):
    code = "".join(random.choices("1234567890", k=6))
    pending_codes[username] = {"code": code, "ts": time.time()}

    if await fetch_profile(username):
        return True
    else:
        raise HTTPException(404, "Username not found")

    # TODO: Check the username and send code inside the game here


@app.post("/verify-login")
async def _(username: str = Form(...), code: str = Form(...)):
    data = pending_codes.get(username)
    if not data or data["code"] != code:
        raise HTTPException(status_code=400, detail="Invalid code")

    del pending_codes[username]

    return {"username": username, "token": f"TOKEN-{username}"}


async def start_api():
    config = uvicorn.Config(app, host="0.0.0.0", port=8000, log_level="debug")
    server = uvicorn.Server(config)
    await server.serve()


if __name__ == "__main__":
    asyncio.run(start_api())
