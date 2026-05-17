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

  constructor(
    private api: ApiService
  ) {}

  // ✅ GET CATEGORY REVIEWS
  getCategoryReviews(
    categoryId: string
  ): Observable<ReviewResponse> {

    return this.api.get<ReviewResponse>(

      API_ENDPOINTS.REVIEWS
        .GET_BY_CATEGORY(categoryId)

    );

  }

  // ✅ CREATE REVIEW
  createReview(data: {

    categoryId: string;

    rating: number;

    comment?: string;

  }): Observable<any> {

    return this.api.post(

      API_ENDPOINTS.REVIEWS.CREATE,

      data

    );

  }

  // ✅ UPDATE REVIEW
  updateReview(

    id: string,

    data: {
      rating?: number;
      comment?: string;
    }

  ): Observable<any> {

    return this.api.put(

      API_ENDPOINTS.REVIEWS.UPDATE(id),

      data

    );

  }

  // ✅ DELETE REVIEW
  deleteReview(
    id: string
  ): Observable<any> {

    return this.api.delete(

      API_ENDPOINTS.REVIEWS.DELETE(id)

    );

  }

  // ✅ LIKE REVIEW
  likeReview(
    reviewId: string
  ): Observable<any> {

    return this.api.post(

      API_ENDPOINTS.REVIEWS
        .LIKE(reviewId),

      {}

    );

  }

  // ✅ DISLIKE REVIEW
  dislikeReview(
    reviewId: string
  ): Observable<any> {

    return this.api.post(

      API_ENDPOINTS.REVIEWS
        .DISLIKE(reviewId),

      {}

    );

  }

}