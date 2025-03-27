import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthenticationService } from '../service/auth.service';
import Swal from 'sweetalert2'; // se estiver usando diretamente


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.authService.currentUser();

    if (!currentUser?.token) {
      this.router.navigate(['auth/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    const decodedToken = jwtDecode<any>(currentUser.token);
    const expectedRoles: string[] = route.data['roles'] || [];
    const expectedPermissions: string[] = route.data['permissions'] || [];

    const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
    const userRoles = Array.isArray(decodedToken[roleClaim]) ? decodedToken[roleClaim] : [decodedToken[roleClaim]];
    const userPermissions = Array.isArray(decodedToken['permission']) ? decodedToken['permission'] : [decodedToken['permission']];

    const hasRole = expectedRoles.length === 0 || expectedRoles.some(role => userRoles.includes(role));
    const hasPermission = expectedPermissions.length === 0 || expectedPermissions.some(p => userPermissions.includes(p));

    if (!hasRole || !hasPermission) {
      Swal.fire({
        icon: 'error',
        title: 'Acesso Negado',
        text: 'Você não tem permissão para acessar esta funcionalidade.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Ok'
      }).then(() => {
        this.router.navigate(['/apps/tools']);
      });

      return false;
    }

    return true;

  }
}
