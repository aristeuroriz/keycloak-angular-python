// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { CommonComponent } from './common/common.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { AuthGuard } from '../services/guard.service';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    data: { roles: ['admin'] }, // Somente usuários com papel 'admin'
    canActivate: [AuthGuard], // Protegido pelo AuthGuard
  },
  {
    path: 'common',
    component: CommonComponent,
    data: { roles: ['common', 'admin'] }, // Usuários com papel 'common' ou 'admin'
    canActivate: [AuthGuard], // Protegido pelo AuthGuard
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent, // Página de acesso não autorizado
  },
];
