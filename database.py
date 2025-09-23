import sqlite3
from typing import List, Optional, Tuple

conn = sqlite3.connect("server/db.sqlite")
cursor = conn.cursor()


def whitelist(gd_account_id: int, gd_username: str, winner_role: bool = False) -> None:
    cursor.execute(
        "INSERT OR REPLACE INTO users (account_id, user_name, is_whitelisted, user_roles) VALUES (?, ?, TRUE, ?)",
        (gd_account_id, gd_username, "winner" if winner_role else None),
    )
    conn.commit()


def unwhitelist_all() -> None:
    cursor.execute("UPDATE users SET is_whitelisted = FALSE")
    conn.commit()


def user_exists(username: str) -> Optional[bool]:
    cursor.execute("SELECT 1 FROM users WHERE user_name = ?", (username,))
    return cursor.fetchone() is not None


def get_all() -> list[dict]:
    cursor.execute("SELECT account_id, user_name, is_whitelisted, active_room_ban FROM users")
    rows = cursor.fetchall()
    return [
        {
            "account_id": r[0],
            "username": r[1],
            "is_whitelisted": r[2],
            "active_room_ban": r[3],
        }
        for r in rows
    ]
