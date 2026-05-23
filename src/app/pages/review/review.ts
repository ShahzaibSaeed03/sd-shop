import {
  CommonModule
} from '@angular/common';

import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  ReviewService
} from '../../core/services/review.api';

@Component({
  selector: 'app-review',
  imports: [CommonModule, FormsModule],
  templateUrl: './review.html',
  styleUrl: './review.css',
})
export class Review implements OnChanges, OnInit {

  @Input() categoryId!: string;

  rating = 0;
  totalReviews = 0;
  selectedRating = 0;
  reviewText = '';
  reviews: any[] = [];
  currentUser: any = null;
  editingReviewId: string | null = null;

  breakdown = [
    { stars: 5, count: 0 },
    { stars: 4, count: 0 },
    { stars: 3, count: 0 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 }
  ];

  constructor(
    private reviewService: ReviewService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUser = JSON.parse(user);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['categoryId'] && this.categoryId) {
      this.loadReviews();
    }
  }

  loadReviews() {
    this.reviewService.getCategoryReviews(this.categoryId).subscribe({
      next: (res: any) => {
        this.rating = res.averageRating || 0;
        this.totalReviews = res.totalReviews || 0;
        this.reviews = (res.reviews || []).map((r: any) => ({
          _id: r._id,
          userId: r.user?._id,
          name: r.user?.name || 'User',
          image: r.user?.avatar || r.user?.picture || 'profile/user.png',
          date: new Date(r.createdAt).toLocaleDateString(),
          rating: r.rating,
          text: r.comment,
          likes: r.likesCount || 0,
          dislikes: r.dislikesCount || 0,
          liked: r.liked || false,
          disliked: r.disliked || false,
          isOwner: this.currentUser?._id === r.user?._id
        }));
        this.calculateBreakdown(res.reviews || []);
        this.cdr.detectChanges();
      },
      error: (err) => { console.error(err); }
    });
  }

  calculateBreakdown(reviews: any[]) {
    this.breakdown.forEach(b => b.count = 0);
    reviews.forEach(r => {
      const found = this.breakdown.find(b => b.stars === r.rating);
      if (found) found.count++;
    });
  }

  submitReview() {
    const token = localStorage.getItem('token');
    if (!token) { alert('Please login first to submit a review.'); return; }
    if (!this.categoryId) { console.error('CategoryId missing'); return; }
    if (!this.selectedRating) { alert('Please select rating'); return; }
    if (!this.reviewText?.trim()) { alert('Please write review'); return; }

    const request = this.editingReviewId
      ? this.reviewService.updateReview(this.editingReviewId, {
          rating: this.selectedRating,
          comment: this.reviewText
        })
      : this.reviewService.createReview({
          categoryId: this.categoryId,
          rating: this.selectedRating,
          comment: this.reviewText
        });

    request.subscribe({
      next: () => {
        this.selectedRating = 0;
        this.reviewText = '';
        this.editingReviewId = null;
        this.loadReviews();
      },
      error: (err) => {
        console.error(err);
        alert(err?.error?.message || 'Review submit failed');
      }
    });
  }

  // ✅ Inline edit — scroll nahi, sirf box mein data set karo
  editReview(review: any) {
    this.editingReviewId = review._id;
    this.selectedRating = review.rating;
    this.reviewText = review.text;
  }

  // ✅ Cancel edit — reset karo
  cancelEdit() {
    this.editingReviewId = null;
    this.selectedRating = 0;
    this.reviewText = '';
  }

  deleteReview(review: any) {
    const ok = confirm('Delete this review?');
    if (!ok) return;
    this.reviewService.deleteReview(review._id).subscribe({
      next: () => { this.loadReviews(); },
      error: (err) => { console.error(err); }
    });
  }

  likeReview(review: any) {
    const token = localStorage.getItem('token');
    if (!token) { alert('Please login first.'); return; }
    this.reviewService.likeReview(review._id).subscribe({
      next: () => { this.loadReviews(); },
      error: (err) => { console.error(err); }
    });
  }

  dislikeReview(review: any) {
    const token = localStorage.getItem('token');
    if (!token) { alert('Please login first.'); return; }
    this.reviewService.dislikeReview(review._id).subscribe({
      next: () => { this.loadReviews(); },
      error: (err) => { console.error(err); }
    });
  }

  setRating(i: number) {
    this.selectedRating = i;
  }

  getPercentage(count: number) {
    return this.totalReviews ? (count / this.totalReviews) * 100 : 0;
  }
}