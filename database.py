import sqlite3

conn = sqlite3.connect("servers.sqlite")
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS servers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    name_eng TEXT NOT NULL,
    host TEXT NOT NULL,
    ip TEXT NOT NULL,
    opensAt TIMESTAMP NOT NULL
)
""")
conn.commit()


def add_server(name: str, name_eng: str, host: str, ip: str, opensAt: str) -> None:
    cursor.execute(
        "INSERT INTO servers (name, name_eng host, ip, opensAt) VALUES (?, ?, ?, ?, ?)",
        (name, name_eng, host, ip, opensAt)
    )
    conn.commit()


def get_server(server_id: int) -> dict | None:
    cursor.execute("SELECT * FROM servers WHERE id=?", (server_id,))
    row = cursor.fetchone()
    if row:
        return dict(row)
    return None


def list_servers() -> list[tuple]:
    cursor.execute("SELECT * FROM servers ORDER BY opensAt ASC")
    rows = cursor.fetchall()
    return [dict(row) for row in rows]


def delete_server(server_id: int) -> None:
    cursor.execute("DELETE FROM servers WHERE id=?", (server_id,))
    conn.commit()
