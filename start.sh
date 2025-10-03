#!/bin/bash

# PORT 4200 - Central API
echo "Starting FastAPI server..."
uvicorn central_api:app --reload --port 4200 &

# PORT 4201 - Central server
cd server
chmod +x ./globed-central-server-x64
./globed-central-server-x64 &
cd ..

# PORT 4202 - Website
echo "Starting npm website..."
cd website
npm run dev -- --port 4202 &
cd ..

wait
