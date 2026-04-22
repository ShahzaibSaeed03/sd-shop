import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';

@Component({
  selector: 'app-review-order',
  standalone: true,
  imports: [CommonModule],
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

ngOnChanges() {
  if (!this.data) return;

  // ✅ ORDER
  this.order = {
    title: this.data?.title || 'Product',
    subtitle: this.data?.subtitle || '',
    price: this.data?.price || 0,
    finalPrice: this.data?.finalPrice || this.data?.price || 0,
    image: this.data?.image || 'assets/cards/card-images.png',
    qty: this.data?.qty || 1
  };

  // ✅ ACCOUNT
  this.account = {
    server: this.data?.server || '-',
    userId: this.data?.userId || '-',
    nickname: this.data?.nickname || '-'
  };

  // ✅ SUMMARY (REAL DATA)
  const subtotal = this.order.price * this.order.qty;

  this.summary = {
    subtotal,
    discount: this.data?.discount || 0,
    coupon: this.data?.coupon || '-',
    final: this.data?.finalPrice || subtotal
  };
}
  removeItem() {
    this.order = null;

    // OR navigate back
    // this.router.navigate(['/']);
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