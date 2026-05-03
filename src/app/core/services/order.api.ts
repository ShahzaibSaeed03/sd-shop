import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api';
import { API_ENDPOINTS } from '../api/endpoints';
import { HttpClient } from '@angular/common/http';

// ==========================
// ✅ TYPES (OPTIONAL BUT CLEAN)
// ==========================
export interface Pricing {
  basePrice: number;
  fee: number;
  total: number;
  method: 'pix' | 'card';
}

export interface CreateOrderResponse {
  order: any;
  payment: any;
  pricing: Pricing;
}

@Injectable({ providedIn: 'root' })
export class OrderApi {
  constructor(
    private api: ApiService,
    private http: HttpClient,
  ) {}

  // ==========================
  // ✅ CALCULATE PRICE
  // ==========================
  calculatePrice(data: {
    amount: number; // ✅ NEW

    method: 'pix' | 'card';
    code?: string;
  }): Observable<Pricing> {
    return this.api.post<Pricing>(API_ENDPOINTS.ORDERS.CALCULATE, data);
  }

  // ==========================
  // ✅ CREATE ORDER
  // ==========================
  createOrder(data: any): Observable<CreateOrderResponse> {
    return this.api.post<CreateOrderResponse>(API_ENDPOINTS.ORDERS.CREATE, data);
  }

  getInstallments(amount: number, bin: string) {
    return this.api.get<any>(`payments/installments?amount=${amount}&bin=${bin}`);
  }
  checkUser(data: { categoryCode: string; userId: string; serverId?: string; nickname?: string }) {
    return this.api.post<any>(API_ENDPOINTS.ORDERS.CHECK_USER, data);
  }
  getMyOrders() {
    return this.api.get<any>(API_ENDPOINTS.ORDERS.MY);
  }
}
