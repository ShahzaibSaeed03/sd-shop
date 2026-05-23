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
      const coinsUsed = useCoins ? +params['coinsUsed'] || 0 : 0;
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

  discount: params['discount']
    ? +params['discount']
    : 0,

  couponDiscount:
    +params['couponDiscount'] || 0,

  qty,

  userId: params['userId'],
  server: params['server'],
  nickname: params['nickname'],
  zone: params['zone'],

  coupon: params['coupon'] || '',

  useCoins,
  coinsUsed,
};

      console.log('CHECKOUT DATA:', this.orderData);
    });
  }
  handlePaymentSuccess(data: any) {
    const orderId = data?.order?._id;

    if (!orderId) return;

    // stay on payment page
    this.step = 2;

    const interval = setInterval(() => {
      fetch(`https://api.sdshop.gg/api/orders/${orderId}`)
        .then((res) => res.json())
        .then((order) => {
          console.log('ORDER STATUS:', order);

          // ✅ when delivery completed
          if (order.supplierStatus === 'completed') {
            clearInterval(interval);

            this.successOrder = {
              orderNumber: order._id || '-',

              orderDate: new Date(order.createdAt).toLocaleDateString(),

              gameName: order.product?.name || '',

              gameUID: order.userGameId || '',

              product: order.product?.name || '',

              server: order.serverId || '',

              total: `R$ ${Number(order.totalAmount || 0).toFixed(2)}`,

              transactionTime: new Date().toLocaleString(),

              image: order.product?.image || '',

              qty: order.quantity || 1,
            };

            // ✅ OPEN SUCCESS SCREEN
            this.step = 3;
          }
        });
    }, 5000);
  }
  goToStep(step: number) {
    this.step = step;
  }
}
