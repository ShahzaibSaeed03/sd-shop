import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { API_ENDPOINTS } from '../api/endpoints';

@Injectable({
  providedIn: 'root',
})
export class CategoryApi {

  private api =
    `${environment.apiUrl}`;

  constructor(
    private http: HttpClient
  ) {}

  getCategories() {
    return this.http.get(
      `${this.api}/${API_ENDPOINTS.CATEGORIES.LIST}`
    );
  }

  searchCategories(q: string) {

    return this.http.get(
      `${this.api}/${API_ENDPOINTS.CATEGORIES.SEARCH(q)}`
    );

  }

}