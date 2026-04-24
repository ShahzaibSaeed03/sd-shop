// services/review.service.ts

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Review } from '../../pages/review/review';
import { ReviewResponse } from '../../shared/models/review.model';
import { API_ENDPOINTS } from '../api/endpoints';
import { ApiService } from './api';


@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private api: ApiService) {}

  // ✅ Get reviews by product
  getProductReviews(productId: string): Observable<ReviewResponse> {
    return this.api.get<ReviewResponse>(
      API_ENDPOINTS.REVIEWS.GET_BY_PRODUCT(productId)
    );
  }

  // ✅ Create review
  createReview(data: {
    productId: string;
    rating: number;
    comment?: string;
  }): Observable<Review> {
    return this.api.post<Review>(
      API_ENDPOINTS.REVIEWS.CREATE,
      data
    );
  }

  // ✅ Update review
  updateReview(
    id: string,
    data: { rating?: number; comment?: string }
  ): Observable<Review> {
    return this.api.put<Review>(
      API_ENDPOINTS.REVIEWS.UPDATE(id),
      data
    );
  }

  // ✅ Delete review
  deleteReview(id: string): Observable<any> {
    return this.api.delete(
      API_ENDPOINTS.REVIEWS.DELETE(id)
    );
  }
}