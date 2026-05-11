// category.api.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryApi {
  private api = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http.get(this.api);
  }
}