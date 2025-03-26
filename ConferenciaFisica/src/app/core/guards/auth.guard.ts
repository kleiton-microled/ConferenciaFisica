import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';

import { AuthenticationService } from '../service/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.authenticationService.currentUser();

    if (!currentUser) {
      // Não autenticado
      this.router.navigate(['auth/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    const expectedRoles = route.data['roles'] as string[];

    // Se não tem roles definidas na rota, apenas verifica login
    if (!expectedRoles || expectedRoles.length === 0) {
      return true;
    }

    const userRoles = currentUser.roles || [];
    const hasRole = userRoles.some((role: string) => expectedRoles.includes(role));

    if (!hasRole) {
      this.router.navigate(['/acesso-negado']);
      return false;
    }

    return true;
  }
}