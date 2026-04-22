import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { ApiService } from './api';
import { API_ENDPOINTS } from '../api/endpoints';

export interface Section {
  _id: string;
  title: string;
  slug: string;
  order: number;
  isActive: boolean;
  // add more fields if needed
}

@Injectable({ providedIn: 'root' })
export class SectionApi {

  constructor(private api: ApiService) {}

  getFrontendSections(): Observable<Section[]> {
    return this.api.get<Section[]>(API_ENDPOINTS.SECTIONS.FRONTEND);
  }
}