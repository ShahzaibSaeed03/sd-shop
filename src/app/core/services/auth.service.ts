import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private _user: any = null;

  constructor() {
    this.loadUser(); // 🔥 important
  }

  setSession(data: any) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    this._user = data.user;
  }

  loadUser() {
    const user = localStorage.getItem('user');
    if (user) {
      this._user = JSON.parse(user);
    }
  }

  getUser() {
    return this._user;
  }

  logout() {
    localStorage.clear();
    this._user = null;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}