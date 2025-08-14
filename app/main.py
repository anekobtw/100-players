import asyncio

import requests
from askip import AskIP
from send import SendMessage
from textual import on, work
from textual.app import App, ComposeResult, Screen
from textual.containers import Center, HorizontalGroup, VerticalGroup
from textual.widgets import Button, DataTable, Footer, Header, Input, Label


class Main(Screen):
    BINDINGS = [
        ("r", "update", "Обновить"),
        ("t", "toggle_register", "Открыть/Закрыть набор"),
        ("u", "unwhitelist_all", "Убрать всех с вайтлиста"),
    ]

    def compose(self) -> ComposeResult:
        # Header and Footer
        yield Header()
        yield Footer()

        # Database
        with HorizontalGroup():
            with VerticalGroup():
                # Info
                yield Label(
                    renderable=f"GLOBED IP: {self.app.GLOBED_URL}\nAPI IP: {self.app.BASE_URL}",
                    classes="box",
                    id="info",
                )

                # Settings
                with VerticalGroup(classes="box", id="settings"):
                    yield Input(
                        placeholder="Установить новый лимит",
                        type="integer",
                        id="limit-input",
                    )
                    yield Input(placeholder="Установить новую ссылку", id="link-input")
                    yield Center(Button(label="Отправить сообщение", id="push-send"))

            # Database
            yield DataTable(classes="box", id="database")

    def on_mount(self) -> None:
        self.query_one("#database").add_columns("account_id", "username", "is_whitelisted", "active_room_ban")

        self.query_one("#info").border_title = "Инфо"
        self.query_one("#database").border_title = "База данных"
        self.query_one("#settings").border_title = "Настройки"

        self.action_update()

    def action_update(self) -> None:
        response = requests.post(self.app.BASE_URL + "/info").json()
        table = self.query_one("#database")

        table.clear()
        table.add_rows(response["database"])
        table.border_subtitle = f"{len(response["database"])} / {response["limit"]} игроков"

    def action_toggle_register(self) -> None:
        response = requests.post(self.app.BASE_URL + "/info").json()
        requests.post(url=self.app.BASE_URL + "/reg", json={"register": not response["register"]})
        self.notify(message="Набор открыт!" if not response["register"] else "Набор закрыт!")

    def action_unwhitelist_all(self) -> None:
        response = requests.post(self.app.BASE_URL + "/unwhitelist").json()
        if response["status"] == "success":
            self.action_update()
            self.notify(message="Все были успешно убраны с вайтлиста!")

    @on(Input.Submitted, "#limit-input")
    def limit_submitted(self, event: Input.Submitted) -> None:
        requests.post(url=self.app.BASE_URL + "/limit", json={"limit": event.value})
        self.action_update()
        self.notify(f"Установлен новый лимит: {event.value}")

    @on(Input.Submitted, "#link-input")
    def link_submitted(self, event: Input.Submitted) -> None:
        requests.post(url=self.app.BASE_URL + "/group", json={"group_url": event.value})
        self.notify(f"Установлена новая ссылка {event.value}")

    @on(Button.Pressed, "#push-send")
    def send_pressed(self, event: Button.Pressed) -> None:
        self.app.push_screen("send")


class Dashboard(App):
    theme = "tokyo-night"
    CSS_PATH = "main.tcss"
    TITLE = "100 игроков"
    ENABLE_COMMAND_PALETTE = False
    SCREENS = {
        "main": Main,
        "askip": AskIP,
        "send": SendMessage,
    }
    NOTIFICATION_TIMEOUT = 2

    @work
    async def on_mount(self) -> None:
        self.GLOBED_URL, self.BASE_URL = await self.push_screen_wait("askip")
        self.push_screen("main")


if __name__ == "__main__":
    app = Dashboard()
    asyncio.run(app.run_async())
