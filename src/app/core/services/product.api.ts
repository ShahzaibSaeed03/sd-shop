import { Injectable } from '@angular/core';
import { ApiService } from './api';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../api/endpoints';

@Injectable({ providedIn: 'root' })
export class ProductApi {

  constructor(private api: ApiService) {}

  // GET PRODUCT DETAILS
  getProductById(id: string): Observable<any> {
    return this.api.get(`products/${id}`);
  }
   getProducts(): Observable<any[]> {
    return this.api.get<any[]>(API_ENDPOINTS.PRODUCTS.LIST);
  }
}