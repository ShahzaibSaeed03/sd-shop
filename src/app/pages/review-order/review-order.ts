import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-review-order',
  imports: [CommonModule, ],
  templateUrl: './review-order.html',
  styleUrl: './review-order.css',
})
export class ReviewOrder {
@Output() next = new EventEmitter<void>();

  // 🔹 STEP
  step = 1;

  // 🔹 ORDER
  order = {
    title: 'Zenless Zone Zero',
    subtitle: 'Inter-Knot Membership x5',
    price: 23.00,
    image: 'cards/card-images.png'
  };

  // 🔹 ACCOUNT
  account = {
    server: 'America',
    userId: '6262626262',
    nickname: 'Jo******th'
  };

  // 🔹 SUMMARY
  summaryOpen = true;
  accountOpen = true;

  summary = {
    subtotal: 96,
    discount: 10,
    coupon: 'MEGA5',
    coins: 890
  };

  get total() {
    return this.summary.subtotal - this.summary.discount;
  }

  // 🔹 ACTIONS
  removeItem() {
    console.log('Item removed');
  }

  toggleSummary() {
    this.summaryOpen = !this.summaryOpen;
  }

  toggleAccount() {
    this.accountOpen = !this.accountOpen;
  }


proceed() {
  this.next.emit(); // instead of local step
}
}