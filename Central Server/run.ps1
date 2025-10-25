$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $root

Start-Process "powershell" -ArgumentList "-NoExit", "-Command", "cd '$root'; poetry run python bot.py"
Start-Process "powershell" -ArgumentList "-NoExit", "-Command", "cd '$root'; uvicorn "
Start-Process "powershell" -ArgumentList "-NoExit", "-Command", "cd '$root\server'; ./globed-central-server.exe"
Start-Process "powershell" -ArgumentList "-NoExit", "-Command", "cd '$root\server'; ./globed-game-server.exe 0.0.0.0:4202 http://127.0.0.1:4201 4m9sQk8vR1tYz2pL0uVwX3nC6bH7qJ5eF2gZ0yU1aV"

Write-Host "[INFO] All processes started in new PowerShell windows."

