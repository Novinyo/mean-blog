import { Injectable } from '@angular/core';
import { AuthData } from '../models/auth-data';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private token: string;
    private isAuthenticated = false;
    private tokenTimer: any;
    private userId: string;
    private authStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router) { }

    getToken() {
        return this.token;
    }

    getStatus() {
        return this.isAuthenticated;
    }

    getUserId() {
        return this.userId;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    createUser(user: AuthData) {
        this.http.post("http://localhost:3000/api/auth/signup", user)
        .subscribe(response => {
            this.router.navigate(['/login']);
        });
    }

    login(user: AuthData) {
        this.http.post<{token: string,
             expiresIn: number, userId: string}>
             ('http://localhost:3000/api/auth/login', user)
        .subscribe(response => {
            const token = response.token;
            
            if(token) {
                const expiresInDuration = response.expiresIn;
                this.setAuthTimer(expiresInDuration);
                this.token = token;
                this.isAuthenticated = true;
                this.userId = response.userId;
                this.authStatusListener.next(true);
                const now = new Date();
                const expirationDate = new Date(now.getTime() + (expiresInDuration * 1000));
                this.saveAuthData(token, expirationDate, this.userId)
                this.router.navigate(['/']);
            }
            
        }, err => {
            console.log(err)
            //this.router.navigate(['/login'])
        });
    }

    autoAuthUser() {
        const authInfo = this.getAuthData();

        if(authInfo) {
            const now = new Date();

            const expiresIn = authInfo.expirationDate.getTime() - now.getTime();

            if(expiresIn > 0) {
                this.token = authInfo.token;
                this.isAuthenticated = true;
                this.userId = authInfo.userId;
                this.setAuthTimer(expiresIn / 1000);
                this.authStatusListener.next(true);
            }
        }
    }

    private setAuthTimer(duration: number) {
        this.tokenTimer = setTimeout(()=>{
            this.logout();
        }, duration * 1000);
    }

    private saveAuthData(token: string,
         expirationDate: Date, userId: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString() )
        localStorage.setItem('userId', userId);
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
    }

    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userid = localStorage.getItem('userId');

        if(!token || !expirationDate) {
            return;
        }
        return {
            'token': token,
            'expirationDate': new Date(expirationDate),
            'userId': userid
        }
    }

    logout() {
        this.token = null;
        this.userId = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.router.navigate(['/']);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
    }
}