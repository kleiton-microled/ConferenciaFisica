import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { User } from '../models/auth.models';
import { ConfigService } from 'src/app/shared/services/config.service';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    user: User | null = null;
    urlAuth: string = "https://localhost:7167/api/Auth/login";

    constructor (private http: HttpClient, configService: ConfigService) {
        //this.urlAuth = configService.getConfig('AUTH');
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
     * Performs the login auth
     * @param email email of user
     * @param password password of user
     */
    // login(email: string, password: string): any {

    //     return this.http.post<any>(`/api/login`, { email, password })
    //         .pipe(map(user => {
    //             // login successful if there's a jwt token in the response
    //             if (user && user.token) {
    //                 this.user = user;
    //                 // store user details and jwt in session
    //                 sessionStorage.setItem('currentUser', JSON.stringify(user));
    //             }
    //             return user;
    //         }));
    // }
    login(usuario: string, senha: string): any {
        return this.http.post<User>(this.urlAuth, { usuario, senha })
          .pipe(map(user => {
            if (user && user.token) {
              this.user = user;
              sessionStorage.setItem('currentUser', JSON.stringify(user));
            }
            return user;
          }));
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

