import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { OrderApi } from '../../core/services/order.api';

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

constructor(
  private router: Router,
  private orderApi: OrderApi
) {}
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
    const maxUsableCoins = Math.floor(subtotal * 100);

const coinsUsed = useCoins
  ? Math.min(
      toNum(this.data?.coinsUsed),
      maxUsableCoins
    )
  : 0;
    const coinsDiscount = coinsUsed / 100;
const couponDiscount = toNum(this.data?.couponDiscount);
    // ✅ For display: subtract coins from subtotal (coupon discount unknown yet, just show code)
    // Note: actual final price will be calculated by backend during payment
    const afterCoupon = subtotal - couponDiscount;

const displayTotal = Math.max(
  0,
  afterCoupon - coinsDiscount
);

    this.order = {
      title: this.data?.subtitle || 'Game',
      subtitle: this.data?.title || 'Product',
      price,
      finalPrice: displayTotal,
      image: this.data?.image || 'assets/cards/card-images.png',
      qty,
    };

    this.account = {
      server: this.data?.server || '-',
      userId: this.data?.userId || '-',
      nickname: this.data?.nickname || '-',
    };

   this.summary = {
  subtotal,

  coupon: couponCode || '-',

  couponDiscount,

  coinsUsed,

  coinsDiscount,

  useCoins,

  final: displayTotal,
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

  const payload = {

    productId: this.data?.id,

    qty: this.data?.qty || 1,

    user_id: this.data?.userId,

    server_id: this.data?.server,

    nickname: this.data?.nickname,

    zone_id: this.data?.zone,

    method: 'pix'

  };

  // ✅ CREATE PENDING ORDER
  this.orderApi
    .createPendingOrder(payload)
    .subscribe({

      next: (res: any) => {

        // save order id
        this.data.orderId = res._id;

        // next step
        this.next.emit();

      },

      error: (err) => {

        console.log(err);

      }

    });

}
}
