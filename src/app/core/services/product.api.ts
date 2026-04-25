import { Injectable } from '@angular/core';
import { ApiService } from './api';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../api/endpoints';

@Injectable({ providedIn: 'root' })
export class ProductApi {

  constructor(private api: ApiService) {}

getProducts(): Observable<any[]> {
  return this.api.get<any[]>(API_ENDPOINTS.PRODUCTS.LIST);
}

getByCategory(categoryId: string): Observable<any[]> {
  return this.api.get<any[]>(
    API_ENDPOINTS.PRODUCTS.BY_CATEGORY(categoryId)
  );
}

getProductById(id: string): Observable<any> {
  return this.api.get(
    API_ENDPOINTS.PRODUCTS.BY_ID(id)
  );
}
}