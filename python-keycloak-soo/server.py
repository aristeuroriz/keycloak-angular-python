from auth import get_current_user_with_role
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenExchangeRequest(BaseModel):
    token: str


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Hello World"}


@app.get(
    "/protected",
    dependencies=[Depends(get_current_user_with_role(["admin", "common"]))],
)
async def get_users(
    user_info: dict = Depends(get_current_user_with_role(["admin", "common"]))
):
    return user_info


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("server:app", host="0.0.0.0", port=8080, reload=True)
