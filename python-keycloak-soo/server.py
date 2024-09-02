from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from keycloak import KeycloakOpenID
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Configuração do Keycloak
keycloak_openid = KeycloakOpenID(
    server_url="http://localhost:3000", client_id="siiah", realm_name="siiah"
)

# Configuração do esquema OAuth2 para extração do token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

print("::: Configuração do Keycloak :::")
print(keycloak_openid.__dict__)
print("::: Configuração do Keycloak :::")


# Dependência personalizada para validar papéis do usuário e o Client ID
def get_current_user_with_role(required_roles: List[str]):
    async def current_user_with_role(token: str = Depends(oauth2_scheme)):
        print("::: Token JWT :::")
        print(token)
        print("::: Token JWT :::")
        try:
            # Valida o token JWT usando o Keycloak
            user_info = keycloak_openid.userinfo(token)
            decoded = keycloak_openid.decode_token(token)

            # Verifica se o token foi emitido pelo Client ID do Angular
            if decoded.get("azp") != "siiah":
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Token not issued for the correct client",
                )

            # Verifica se o usuário tem o papel necessário
            roles = decoded.get("realm_access", {}).get("roles", [])

            if any(role in roles for role in required_roles):
                return user_info  # Usuário tem o papel necessário
            else:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="User does not have the required role",
                )
        except Exception as e:
            print("::: Erro ao validar token JWT :::")
            print(e)
            print("::: Erro ao validar token JWT :::")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=e.error,
            )

    return current_user_with_role


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
