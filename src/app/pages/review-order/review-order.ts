import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-review-order',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './review-order.html',
})
export class ReviewOrder implements OnChanges {
  @Input() data: any;
  @Output() next = new EventEmitter<void>();

  // 🔥 DYNAMIC DATA
  order: any = {};
  account: any = {};
  summary: any = {};

  summaryOpen = true;
  accountOpen = true;

  constructor(private router: Router) {}

 ngOnChanges() {
  if (!this.data) return;

  const toNum = (v: any, fallback = 0): number => {
    const n = Number(v);
    return isNaN(n) ? fallback : n;
  };

  const toBool = (v: any): boolean => {
    return v === true || v === 'true' || v === 1 || v === '1';
  };

  const price = toNum(this.data?.price);
  const qty = toNum(this.data?.qty, 1);
  const subtotal = price * qty;

  // ✅ Coupon (display only — backend will calculate at order)
  const couponCode = this.data?.coupon || '';

  // ✅ Coins
  const useCoins = toBool(this.data?.useCoins);
  const coinsUsed = useCoins ? toNum(this.data?.coinsUsed) : 0;
  const coinsDiscount = coinsUsed / 100;

  // ✅ For display: subtract coins from subtotal (coupon discount unknown yet, just show code)
  // Note: actual final price will be calculated by backend during payment
  const displayTotal = Math.max(0, subtotal - coinsDiscount);

  this.order = {
    title: this.data?.title || 'Game',
    subtitle: this.data?.subtitle || 'Product',
    price,
    finalPrice: displayTotal,
    image: this.data?.image || 'assets/cards/card-images.png',
    qty
  };

  this.account = {
    server: this.data?.server || '-',
    userId: this.data?.userId || '-',
    nickname: this.data?.nickname || '-'
  };

  this.summary = {
    subtotal,
    coupon: couponCode || '-',
    coinsUsed,
    coinsDiscount,
    useCoins,
    final: displayTotal
  };
}

  removeItem() {
    this.order = null;
  }

  goHome() {
    this.router.navigate(['/']);
  }

  get total() {
    return this.summary?.final || 0;
  }

  toggleSummary() {
    this.summaryOpen = !this.summaryOpen;
  }

  toggleAccount() {
    this.accountOpen = !this.accountOpen;
  }

  proceed() {
    this.next.emit();
  }
}
