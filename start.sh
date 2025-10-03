#!/bin/bash

echo "Starting FastAPI server..."
uvicorn api:app --reload &

echo "Starting npm website..."
cd website
npm run dev &

wait
