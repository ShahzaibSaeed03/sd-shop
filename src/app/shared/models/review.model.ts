// models/review.model.ts

export interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  product: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewResponse {
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
}