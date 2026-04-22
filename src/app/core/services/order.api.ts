import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api';
import { API_ENDPOINTS } from '../api/endpoints';

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

  constructor(private api: ApiService) {}

  // ==========================
  // ✅ CALCULATE PRICE
  // ==========================
  calculatePrice(data: {
    productId: string;
    method: 'pix' | 'card';
    code?: string;
  }): Observable<Pricing> {
    return this.api.post<Pricing>(
      API_ENDPOINTS.ORDERS.CALCULATE,
      data
    );
  }

  // ==========================
  // ✅ CREATE ORDER
  // ==========================
  createOrder(data: any): Observable<CreateOrderResponse> {
    return this.api.post<CreateOrderResponse>(
      API_ENDPOINTS.ORDERS.CREATE,
      data
    );
  }
}