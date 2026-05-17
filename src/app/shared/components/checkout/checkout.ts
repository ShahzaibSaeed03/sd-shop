import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReviewOrder } from '../../../pages/review-order/review-order';
import { Payment } from '../../../pages/payment/payment';
import { SucessPayment } from '../../../pages/sucess-payment/sucess-payment';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReviewOrder, Payment, SucessPayment],
  templateUrl: './checkout.html',
})
export class Checkout implements OnInit {
  step = 1;
successOrder: any = null;
  // 🔥 RECEIVED DATA
  orderData: any = {};
  paymentMethod: 'card' | 'pix' = 'card';

  paymentForm = {
    buyerName: '',
    cpf: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    installments: 1,
  };

  installmentOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  errors: any = {};

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {

      const price = +params['price'] || 0;
      const qty = Number(params['qty']) || 1;

      // ✅ Coins flags — query params arrive as STRINGS
      const useCoins = params['useCoins'] === 'true' || params['useCoins'] === true;
      const coinsUsed = useCoins ? (+params['coinsUsed'] || 0) : 0;
      const coinsDiscount = coinsUsed / 100; // 100 coins = R$1.00

      // ✅ Final price (parent already calculated payableAmount)
      const subtotal = price * qty;
      const finalPrice = params['finalPrice']
        ? +params['finalPrice']
        : Math.max(0, subtotal - coinsDiscount);

      this.orderData = {
        id: params['id'],
        title: params['title'],
        subtitle: params['subtitle'],
        image: params['image'],
        email: params['email'] || '',

        price,
        finalPrice,
        discount: params['discount'] ? +params['discount'] : 0,
        qty,

        userId: params['userId'],
        server: params['server'],
        nickname: params['nickname'],
        zone: params['zone'],

        coupon: params['coupon'] || '',

        // ✅ THESE WERE MISSING — pass coins data to review-order
        useCoins,
        coinsUsed,
      };

      console.log('CHECKOUT DATA:', this.orderData);
    });
  }
handlePaymentSuccess(data: any) {

  console.log('PAYMENT SUCCESS =>', data);

  this.successOrder = {
    orderNumber: data?.order?._id || '-',

    orderDate: new Date().toLocaleDateString(),

    gameName: data?.product?.categoryName || '',

    gameUID: data?.order?.userGameId || '',

    product: data?.product?.displayName || data?.product?.name || '',

    server: data?.order?.serverId || '',

    total: `R$ ${Number(data?.order?.amount || 0).toFixed(2)}`,

    transactionTime: new Date().toLocaleString(),

    image: data?.product?.image || '',

    qty: data?.order?.quantity || 1
  };

  this.step = 3;
}
  goToStep(step: number) {
    this.step = step;
  }
}