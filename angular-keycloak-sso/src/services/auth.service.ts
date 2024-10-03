import { Injectable } from '@angular/core';
import {
  KeycloakEvent,
  KeycloakEventType,
  KeycloakService,
} from 'keycloak-angular';

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
        if (!authenticated) {
          window.location.reload();
        }
        console.log('Autenticado:', authenticated);
        const token = this.keycloak.getKeycloakInstance().token;
        const refreshToken = this.keycloak.getKeycloakInstance().refreshToken;
        if (token) sessionStorage.setItem('token', token);
        if (refreshToken) sessionStorage.setItem('refreshToken', refreshToken);
      })
      .catch((error) => {
        console.error('Erro ao inicializar o Keycloak:', error);
      });

    this.keycloak.keycloakEvents$.subscribe({
      next: (event: KeycloakEvent): void => {
        if (event.type == KeycloakEventType.OnTokenExpired) {
          const tokenUpdate = this.keycloak.updateToken(30);
          console.log('Token atualizado:', tokenUpdate);
          const token = this.keycloak.getKeycloakInstance().token;
          if (token) sessionStorage.setItem('token', token);
        }
      },
    });
  }

  logout(): void {
    this.keycloak.logout();
  }
}
