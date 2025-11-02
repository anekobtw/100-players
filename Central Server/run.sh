#!/bin/bash

# PORT 4200 - API and Bot
poetry run python bot.py
sleep 2

# PORT 4201 - Central server
cd server
chmod +x ./globed-central-server-x64
./globed-central-server-x64 &
cd ..
sleep 2

# PORT 4202 - Game Server
cd server
chmod +x ./globed-game-server-x64
./globed-game-server-x64 0.0.0.0:4202 http://127.0.0.1:4201 4m9sQk8vR1tYz2pL0uVwX3nC6bH7qJ5eF2gZ0yU1aV &
cd ..
sleep 2

# PORT 4203 - Website
# echo -e "${RED}[INFO] Starting website on port 4203...${NC}"
# cd website
# npm run dev -- --port 4203 &
# cd ..
# sleep 2
#

wait
