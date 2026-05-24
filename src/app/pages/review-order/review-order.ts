import {
  CommonModule
} from '@angular/common';

import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges
} from '@angular/core';

import {
  Router,
  RouterModule
} from '@angular/router';

import {
  OrderApi
} from '../../core/services/order.api';

@Component({
  selector: 'app-review-order',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './review-order.html',
})
export class ReviewOrder implements OnChanges {

  @Input() data: any;

  @Output()
  next = new EventEmitter<void>();

  // DATA
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

    if (!this.data) {
      return;
    }

    const toNum = (
      v: any,
      fallback = 0
    ): number => {

      const n = Number(v);

      return isNaN(n)
        ? fallback
        : n;
    };

    const toBool = (
      v: any
    ): boolean => {

      return (
        v === true ||
        v === 'true' ||
        v === 1 ||
        v === '1'
      );

    };

    // PRICE
    const price =
      toNum(this.data?.price);

    const qty =
      toNum(
        this.data?.qty,
        1
      );

    // SUBTOTAL
    const subtotal =
      price * qty;

    // COUPON
    const couponCode =
      this.data?.coupon || '';

    const couponDiscount =
      toNum(
        this.data?.couponDiscount
      );

    // AFTER COUPON
    const afterCoupon =
      Math.max(
        0,
        subtotal - couponDiscount
      );

    // COINS
    const useCoins =
      toBool(
        this.data?.useCoins
      );

    const maxUsableCoins =
      Math.floor(
        afterCoupon * 100
      );

    const coinsUsed =
      useCoins
        ? Math.min(
            toNum(
              this.data?.coinsUsed
            ),
            maxUsableCoins
          )
        : 0;

    const coinsDiscount =
      coinsUsed / 100;

    // FINAL TOTAL
    const displayTotal =
      Math.max(
        0,
        afterCoupon - coinsDiscount
      );

    // ✅ CASHBACK 1%
    const cashback =
      Number(
        (displayTotal * 0.01)
          .toFixed(2)
      );

    // ORDER
    this.order = {

      title:
        this.data?.subtitle ||
        'Game',

      subtitle:
        this.data?.title ||
        'Product',

      price,

      finalPrice:
        displayTotal,

      image:
        this.data?.image ||
        'assets/cards/card-images.png',

      qty,

    };

    // ACCOUNT
    this.account = {

      server:
        this.data?.server ||
        '-',

      userId:
        this.data?.userId ||
        '-',

      nickname:
        this.data?.nickname ||
        '-',

    };

    // SUMMARY
    this.summary = {

      subtotal,

      coupon:
        couponCode || '-',

      couponDiscount,

      coinsUsed,

      coinsDiscount,

      useCoins,

      cashback,

      final:
        displayTotal,

    };

  }

  removeItem() {
    this.order = null;
  }

  goHome() {
    this.router.navigate(['/']);
  }

  // TOTAL
  get total() {
    return this.summary?.final || 0;
  }

  // CASHBACK


  toggleSummary() {
    this.summaryOpen = !this.summaryOpen;
  }

  toggleAccount() {
    this.accountOpen = !this.accountOpen;
  }

  proceed() {

    const payload = {

      productId:
        this.data?.id,

      qty:
        this.data?.qty || 1,

      user_id:
        this.data?.userId,

      server_id:
        this.data?.server,

      nickname:
        this.data?.nickname,

      zone_id:
        this.data?.zone,

      method: 'pix'

    };

    // CREATE ORDER
    this.orderApi
      .createPendingOrder(payload)
      .subscribe({

        next: (res: any) => {

          // SAVE ORDER ID
          this.data.orderId =
            res._id;

          // NEXT STEP
          this.next.emit();

        },

        error: (err) => {

          console.log(err);

        }

      });

  }
get cashbackAmount(): number {

  return Number(
    (this.total * 0.01).toFixed(2)
  );
}
get cashbackCoins(): number {

  // 100 coins = R$1
  return Math.floor(this.cashbackAmount * 100);
}
}