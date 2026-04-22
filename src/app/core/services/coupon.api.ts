import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api';
import { API_ENDPOINTS } from '../api/endpoints';

// 🔹 RESPONSE TYPES
export interface ApplyCouponResponse {
  success: boolean;
  discount: number;
  finalAmount: number;
  appliedOn: number;
  coupon: string;
}

export interface ApplyCouponPayload {
  code: string;
  totalAmount: number;
  cartProducts: { _id: string }[];
}

@Injectable({ providedIn: 'root' })
export class CouponApi {

  constructor(private api: ApiService) {}

  // ✅ APPLY COUPON
  applyCoupon(payload: ApplyCouponPayload): Observable<ApplyCouponResponse> {
    return this.api.post<ApplyCouponResponse>(
      API_ENDPOINTS.COUPON.APPLY,
      payload
    );
  }

  // ✅ GET ALL (ADMIN)
//   getCoupons(params?: any): Observable<any> {
//     return this.api.get<any>(API_ENDPOINTS.COUPON.LIST, params);
//   }

  // ✅ GET ONE
//   getCouponById(id: string): Observable<any> {
//     return this.api.get<any>(API_ENDPOINTS.COUPON.GET_ONE(id));
//   }
}