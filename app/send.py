import requests
from textual import on
from textual.app import ComposeResult, Screen
from textual.containers import CenterMiddle, HorizontalGroup
from textual.widgets import Button, Input, TextArea


class SendMessage(Screen[None]):
    CSS = """
    HorizontalGroup { align: center middle; }
    Input { width: 60; }
    TextArea { width: 60; }
    """

    def compose(self) -> ComposeResult:
        with CenterMiddle():
            yield Input(placeholder="От", id="from-input")
            yield Input(placeholder="Кому (Телеграм айди)", type="integer", id="to-input")
            yield TextArea(theme="dracula", show_line_numbers=False, id="message-input")

        with HorizontalGroup():
            yield Button(label="Назад", variant="error", id="back-button")
            yield Button(label="Загрузить шаблон", variant="primary", id="load-template-button")
            yield Button(label="Отправить", variant="success", id="send-message-button")

    @on(Button.Pressed, "#load-template-button")
    async def load_template(self, event: Button.Pressed) -> None:
        self.query_one("#from-input").value = "Администрация проекта"
        self.query_one("#to-input").value = ""
        self.query_one("#message-input").load_text("Здравствуйте!\n\nБлагодарим за ваше сообщение.")

    @on(Button.Pressed, "#send-message-button")
    async def send_message(self, event: Button.Pressed) -> None:
        requests.post(
            url=self.app.BASE_URL + "/send",
            json={
                "from": self.query_one("#from-input").value,
                "to": self.query_one("#to-input").value,
                "text": self.query_one("#message-input").text,
            },
        )

    @on(Button.Pressed, "#back-button")
    async def back(self, event: Button.Pressed) -> None:
        self.dismiss()
