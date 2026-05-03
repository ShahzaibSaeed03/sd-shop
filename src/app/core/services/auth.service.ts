import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private _user: any = null;

constructor(private http: HttpClient) {
  this.loadUser();
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
  getCashback(): Observable<any> {
  return this.http.get(`${environment.apiUrl}/auth/cashback`).pipe(
    tap((res: any) => {
      // optional: user object me merge kar do
      if (this._user) {
        this._user.cashbackPoints = res.points;
      }
    })
  );
}
}