import ipaddress

from textual import on
from textual.app import ComposeResult, Screen
from textual.containers import CenterMiddle
from textual.validation import Function
from textual.widgets import Input


class AskIP(Screen[tuple[str, str]]):
    CSS = """
    Input.-valid { outline: tall $success; }
    Input { width: 60; }
    """

    def compose(self) -> ComposeResult:
        with CenterMiddle():
            yield Input(
                placeholder="Enter Server IP:",
                validators=[Function(self.is_ipv4)],
                id="ip-input",
            )

    def is_ipv4(self, value: str) -> bool:
        try:
            ipaddress.IPv4Network(value)
            return True
        except ValueError:
            return False

    @on(Input.Submitted, "#ip-input")
    async def submitted(self, event: Input.Submitted) -> None:
        if event.validation_result.is_valid:
            self.dismiss((f"http://{event.value}:4201", f"http://{event.value}:2000"))
        else:
            self.notify(message="Это не айпи.", severity="error")
