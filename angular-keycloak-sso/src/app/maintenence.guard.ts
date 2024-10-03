import { CanActivateFn } from '@angular/router';

export const maintenenceGuard: CanActivateFn = (route, state) => {
  return true;
};
