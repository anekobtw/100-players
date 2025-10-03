#!/bin/bash

# PORT 4203
echo "Starting game server"
chmod +x ./globed-game-server-x64
./globed-game-server-x64 0.0.0.0:4203 http://127.0.0.1:4201 4m9sQk8vR1tYz2pL0uVwX3nC6bH7qJ5eF2gZ0yU1aV

# PORT 4204
echo "Starting game FastAPI server..."
uvicorn api:app --reload --port 4204 &

wait
