from typing import List

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from keycloak import KeycloakOpenID

# Configuração do Keycloak
keycloak_openid = KeycloakOpenID(
    server_url="http://localhost:3000", client_id="siiah", realm_name="siiah"
)

# Configuração do esquema OAuth2 para extração do token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def get_current_user_with_role(required_roles: List[str]):
    async def current_user_with_role(token: str = Depends(oauth2_scheme)):
        try:
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
                    detail="Invalid token",
                )

        except Exception as e:
            if "401" in str(e):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token",
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=e,
                )

    return current_user_with_role
