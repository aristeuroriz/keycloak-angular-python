import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private keycloak: KeycloakService) {}

  async initKeycloak(): Promise<any> {
    await this.keycloak
      .init({
        config: {
          url: 'http://localhost:3000', // URL do servidor Keycloak
          realm: 'siiah', // Nome do seu realm
          clientId: 'siiah', // Client ID do seu frontend
        },
        initOptions: {
          onLoad: 'login-required',
          checkLoginIframe: false,
          pkceMethod: 'S256',
        },
      })
      .then((authenticated) => {
        console.log(authenticated ? 'Autenticado' : 'Não autenticado');
      })
      .catch((error) => {
        console.error('Erro ao inicializar o Keycloak:', error);
      });
  }

  logout(): void {
    this.keycloak.logout();
  }
}
