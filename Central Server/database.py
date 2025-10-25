import sqlite3

globed_conn = sqlite3.connect("./server/db.sqlite")
globed_curr = globed_conn.cursor()


def whitelist(gd_account_id: int, gd_username: str, is_winner: bool = False) -> None:
    globed_curr.execute(
        "INSERT INTO punishments (account_id, type, reason, expires_at, type2) VALUES (?, ?, ?, ?, ?)",
        (gd_account_id, "mute", "None", 0, "mute"),
    )
    punishment_id = globed_curr.lastrowid

    globed_curr.execute(
        "INSERT OR REPLACE INTO users (account_id, user_name, is_whitelisted, user_roles, active_mute) VALUES (?, ?, TRUE, ?, ?)",
        (gd_account_id, gd_username, "winner" if is_winner else None, punishment_id),
    )
    globed_conn.commit()


def unwhitelist_all() -> None:
    globed_curr.execute("UPDATE users SET is_whitelisted = FALSE")
    globed_conn.commit()


def get_username(user_id: int) -> str:
    globed_curr.execute("SELECT user_name FROM users WHERE account_id = ?", (user_id,))
    return globed_curr.fetchone()


def get_all() -> list[tuple]:
    globed_curr.execute(
        "SELECT account_id, user_name, is_whitelisted, active_room_ban FROM users"
    )
    return globed_curr.fetchall()
