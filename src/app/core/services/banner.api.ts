import { Injectable } from '@angular/core';
    
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../api/endpoints';
import { ApiService } from './api';

export interface Banner {
  _id: string;
  image: string;
  title?: string;
}

@Injectable({ providedIn: 'root' })
export class BannerApi {

  constructor(private api: ApiService) {}

  getBanners(): Observable<Banner[]> {
    return this.api.get<Banner[]>(API_ENDPOINTS.BANNER.LIST);
  }
}