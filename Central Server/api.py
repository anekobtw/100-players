from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class RequestData(BaseModel):
    admin_name: str
    user_id: str


@app.post("/request")
async def handle_request(data: RequestData):
    return {
        "message": f"Request received from {data.admin_name} for user {data.user_id}"
    }
