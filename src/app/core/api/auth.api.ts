import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from './endpoints';
import { ApiService } from '../services/api';

@Injectable({ providedIn: 'root' })
export class AuthApi {

  constructor(private api: ApiService) {}

  register(data: { name: string; email: string; password: string }) {
    return this.api.post(API_ENDPOINTS.AUTH.REGISTER, data);
  }

  login(data: { email: string; password: string }) {
    return this.api.post(API_ENDPOINTS.AUTH.LOGIN, data);
  }

  googleLogin(token: string) {
    return this.api.post(API_ENDPOINTS.AUTH.GOOGLE, { token });
  }
}