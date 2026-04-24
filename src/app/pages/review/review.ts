import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../core/services/review.api';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review.html',
  styleUrl: './review.css',
})
export class Review implements OnChanges {

  // ✅ Receive from parent
  @Input() productId!: string;

  rating = 0;
  totalReviews = 0;

  breakdown = [
    { stars: 5, count: 0 },
    { stars: 4, count: 0 },
    { stars: 3, count: 0 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 }
  ];

  selectedRating = 0;
  reviewText = '';

  reviews: any[] = [];

  constructor(private reviewService: ReviewService,  private cdr: ChangeDetectorRef
) {}

  // ✅ Trigger when productId changes
 ngOnChanges(changes: SimpleChanges) {
  console.log('Product ID:', this.productId); // 👈 check here

  if (changes['productId'] && this.productId) {
    this.loadReviews();
  }
}

  // ✅ Load reviews from backend
loadReviews() {
  this.reviewService.getProductReviews(this.productId)
    .subscribe((res: any) => {

      this.rating = res.averageRating;
      this.totalReviews = res.totalReviews;

      this.reviews = res.reviews.map((r: any) => ({
        name: r.user?.name || 'User',
        date: new Date(r.createdAt).toLocaleDateString(),
        rating: r.rating,
        text: r.comment,
        likes: 0,
        dislikes: 0
      }));

      this.calculateBreakdown(res.reviews);

      this.cdr.detectChanges(); // 🔥 FORCE UI UPDATE
    });
}
  // ✅ Breakdown calculation
  calculateBreakdown(reviews: any[]) {
    this.breakdown.forEach(b => b.count = 0);

    reviews.forEach(r => {
      const found = this.breakdown.find(b => b.stars === r.rating);
      if (found) found.count++;
    });
  }

  // ✅ Submit review
  submitReview() {

    if (!this.productId) {
      console.error('❌ ProductId missing');
      return;
    }

    if (!this.selectedRating) {
      alert('Please select rating');
      return;
    }

    if (!this.reviewText) {
      alert('Please write review');
      return;
    }

    this.reviewService.createReview({
      productId: this.productId,
      rating: this.selectedRating,
      comment: this.reviewText
    }).subscribe({
      next: () => {

        // reset form
        this.selectedRating = 0;
        this.reviewText = '';

        // reload reviews
        this.loadReviews();
      },
      error: (err) => {
        console.error('❌ Create review error:', err);
      }
    });
  }

  // ✅ Select star
  setRating(i: number) {
    this.selectedRating = i;
  }

  // ✅ Progress bar %
  getPercentage(count: number) {
    return this.totalReviews
      ? (count / this.totalReviews) * 100
      : 0;
  }
}