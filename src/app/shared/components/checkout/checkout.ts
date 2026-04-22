import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReviewOrder } from "../../../pages/review-order/review-order";
import { Payment } from "../../../pages/payment/payment";
import { SucessPayment } from "../../../pages/sucess-payment/sucess-payment";

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReviewOrder, Payment, SucessPayment],
  templateUrl: './checkout.html',
})
export class Checkout implements OnInit {

  step = 1;

  // 🔥 RECEIVED DATA
  orderData: any = {};

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {

      this.orderData = {
        id: params['id'],
        title: params['title'],
        subtitle: params['subtitle'],
        image: params['image'],

        price: +params['price'] || 0,

        // ✅ SAFE FALLBACK
        finalPrice: params['finalPrice']
          ? +params['finalPrice']
          : (+params['price'] || 0) * (Number(params['qty']) || 1),

        discount: params['discount'] ? +params['discount'] : 0,

        qty: Number(params['qty']) || 1,

        userId: params['userId'],
        server: params['server'],
        nickname: params['nickname'],
        zone: params['zone'],
        coupon: params['coupon'] || ''
      };

      console.log('CHECKOUT DATA:', this.orderData);
    });
  }

  goToStep(step: number) {
    this.step = step;
  }
}