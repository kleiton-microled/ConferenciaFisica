import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { User } from '../models/auth.models';
import { ConfigService } from 'src/app/shared/services/config.service';
import { jwtDecode } from 'jwt-decode';
import { Subject } from 'rxjs';
import { Patio } from 'src/app/apps/tools/model/patio.model';

export interface DecodedToken {
  nameid: string;         // ClaimTypes.NameIdentifier
  name: string;           // ClaimTypes.Name
  role?: string | string[]; // Pode ser uma ou várias roles
  permission?: string | string[]; // Permissões personalizadas
  exp: number;            // Expiração
  iss: string;            // Emissor
  aud: string;            // Audiência
}

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  user: User | null = null;

  urlAuth: string ="";// "https://api-usuariosdev.bandeirantesdeicmar.com.br/api/Auth/login";
  //urlAuth: string = "https://localhost:7167/api/Auth/login";

  constructor(private http: HttpClient, private configService: ConfigService) {
    
  }

  /**
   * Returns the current user
   */
  public currentUser(): User | null {
    if (!this.user) {
      this.user = JSON.parse(sessionStorage.getItem('currentUser')!);
    }
    return this.user;
  }

  /**
   * Metodo que retonar o token e suas claims para o usuario
   * @param usuario 
   * @param senha 
   * @returns 
   */
  login(usuario: string, senha: string): any {
    this.urlAuth = this.configService.getConfig('AUTH_URL');
    
    console.log('URL Auth: ', this.urlAuth);
    return this.http.post<User>(this.urlAuth, { usuario, senha }).pipe(
      map(user => {
        if (user && user.token) {
          const decoded = jwtDecode<any>(user.token);

          user.username = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
          user.roles = Array.isArray(decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"])
            ? decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
            : [decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]];
          user.permissions = decoded["permission"] || [];
          user.patio = { id: 0, descricao: '' }

          this.user = user;

          // Salva no sessionStorage
          sessionStorage.setItem('currentUser', JSON.stringify(user));

        }

        return user;
      })
    );
  }

  /**
   * Update no patio dentro do objeto de usuario logado
   * @param patio 
   * @returns 
   */
  setPatio(patio: Patio): void {
    const usuario = this.currentUser();
    if (!usuario) return;

    usuario.patio = patio;
    sessionStorage.setItem('currentUser', JSON.stringify(usuario));
  }

  /**
   * Performs the signup auth
   * @param name name of user
   * @param email email of user
   * @param password password of user
   */
  signup(name: string, email: string, password: string): any {
    return this.http.post<any>(`/api/signup`, { name, email, password })
      .pipe(map(user => user));

  }

  /**
   * Logout the user
   */
  logout(): void {
    // remove user from session storage to log user out
    sessionStorage.removeItem('currentUser');
    this.user = null;
  }
}

