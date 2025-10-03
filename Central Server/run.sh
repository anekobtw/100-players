#!/bin/bash

RED='\033[0;31m'
NC='\033[0m'

# Update
echo -e "${RED}[INFO] Updating config from database ${NC}"
python3 database.py

# PORT 4200 - Main API
echo -e "${RED}[INFO] Starting FastAPI server on port 4200...${NC}"
uvicorn api:app --reload --port 4200 &
sleep 2

# PORT 4201 - In-game server
echo -e "${RED}[INFO] Starting game server on port 4201... ${NC}"
cd server
chmod +x ./globed-central-server-x64
./globed-central-server-x64 &
cd ..
sleep 2

# PORT 4202 - Website
echo -e "${RED}[INFO] Starting website on port 4202...${NC}"
cd website
npm run dev -- --port 4202 &
cd ..
sleep 2

wait
