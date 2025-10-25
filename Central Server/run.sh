#!/bin/bash

RED='\033[0;31m'
NC='\033[0m'

# Bot
echo -e "${RED}[INFO] Running the bot ${NC}"
poetry run python bot.py

# PORT 4201 - Central server
echo -e "${RED}[INFO] Starting Central server on port 4201... ${NC}"
cd server
chmod +x ./server/globed-central-server-x64
./server/globed-central-server-x64 &
cd ..
sleep 2

# PORT 4202 - Game Server
echo "Starting game server"
chmod +x ./server/globed-game-server-x64
./server/globed-game-server-x64 0.0.0.0:4202 http://127.0.0.1:4201 4m9sQk8vR1tYz2pL0uVwX3nC6bH7qJ5eF2gZ0yU1aV

# PORT 4200 - Main API
# echo -e "${RED}[INFO] Starting FastAPI server on port 4200...${NC}"
# uvicorn api:app --reload --port 4200 &
# sleep 2

# PORT 4202 - Website
# echo -e "${RED}[INFO] Starting website on port 4202...${NC}"
# cd website
# npm run dev -- --port 4202 &
# cd ..
# sleep 2
#
wait
