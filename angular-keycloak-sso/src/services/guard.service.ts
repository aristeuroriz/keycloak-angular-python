import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard extends KeycloakAuthGuard {
  constructor(
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService
  ) {
    super(router, keycloak);
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    // Forçar o usuário a fazer login se não estiver autenticado.
    if (!this.authenticated) {
      await this.keycloak.login({
        redirectUri: window.location.origin + state.url,
      });
      return false; // Aguarda o login e não permite acesso sem autenticação
    }

    // Buscar os papéis do usuário autenticado.
    const requiredRoles = route.data['roles'];

    // Habilitar o acesso se não houver papéis requeridos.
    if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
      return true;
    }

    // Habilitar o acesso se o usuário tiver pelo menos um dos papéis requeridos.
    const hasRole = requiredRoles.some((role) => this.roles.includes(role));

    if (hasRole) {
      return true; // Usuário tem permissão, acesso permitido
    } else {
      // Redirecionar para a página de erro se o usuário não tiver permissão.
      this.router.navigate(['/unauthorized']); // Corrige o redirecionamento para a página de "Não Autorizado"
      return false;
    }
  }
}
