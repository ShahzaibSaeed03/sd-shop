import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-review',
  imports: [CommonModule],
  templateUrl: './review.html',
  styleUrl: './review.css',
})
export class Review {

  rating = 5;
  totalReviews = 2;

  breakdown = [
    { stars: 5, count: 2 },
    { stars: 4, count: 0 },
    { stars: 3, count: 0 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 }
  ];

  selectedRating = 0;

  reviews = [
    {
      name: 'Ema Norton',
      date: 'July 6, 2023',
      rating: 5,
      text: `I've heard the argument that “lorem ipsum” is effective in wireframing or design because it helps people focus on the actual layout.`,
      likes: 2,
      dislikes: 0
    },
    {
      name: 'Ema Norton',
      date: 'July 6, 2023',
      rating: 5,
      text: `I've heard the argument that “lorem ipsum” is effective in wireframing or design because it helps people focus on the actual layout.`,
      likes: 2,
      dislikes: 0
    }
  ];

  setRating(i: number) {
    this.selectedRating = i;
  }

  getPercentage(count: number) {
    return this.totalReviews ? (count / this.totalReviews) * 100 : 0;
  }

}