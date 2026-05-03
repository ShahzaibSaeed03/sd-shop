import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateOrderResponse, OrderApi } from '../../core/services/order.api';
import { ChangeDetectorRef } from '@angular/core';
import { loadMercadoPago } from '@mercadopago/sdk-js';
@Component({
  selector: 'app-payment',
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
})
export class Payment implements OnInit {
mp: any;
  @Input() data: any;

  @Output() next = new EventEmitter<CreateOrderResponse>();
  @Output() back = new EventEmitter<void>();

  selectedMethod: 'pix' | 'card' = 'card';
  loading = false;
  order: any = {};
  summary: any = {};
  isCalculating = false;
  isPaying = false;
  pixData: any = null;
  showPix = false;
  buyerName = '';
cpf = '';
installments = 1;
installmentsList: any[] = [];
selectedInstallment: any = null;
card = {
  number: '',
  expiry: '',
  cvv: '',
  token: '' // later MP token
};
  constructor(private orderApi: OrderApi, private cd: ChangeDetectorRef
  ) { }
async ngOnInit() {
  if (!this.data) return;

  // 🔥 INIT MERCADOPAGO HERE
  await loadMercadoPago();
  this.mp = new (window as any).MercadoPago(
    'APP_USR-35791197-77cc-4080-845b-919331802ceb'
  );

  // ===== YOUR EXISTING CODE =====
  this.order = {
    title: this.data.title,
    subtitle: this.data.subtitle,
    image: this.data.image,
    qty: this.data.qty || 1,
    price: this.data.price || 0,
    finalPrice: this.data.finalPrice || this.data.price || 0,
    discount: this.data.discount || 0
  };

  const subtotal = this.order.price * this.order.qty;

  this.summary = {
    subtotal,
    discount: this.order.discount,
    total: this.data.finalPrice || subtotal,
    coupon: this.data.coupon || '-',
    userId: this.data.userId,
    server: this.data.server,
    nickname: this.data.nickname
  };

  this.calculate();
}
onCardInput() {
  const clean = this.card.number?.replace(/\D/g, '');
  const bin = clean.slice(0, 6);

  console.log('BIN:', bin);

  if (bin.length === 6) {
    this.fetchInstallments(bin);
  }
}
fetchInstallments(bin: string) {
  this.orderApi.getInstallments(this.summary.total, bin).subscribe({
    next: (res) => {
      const payerCosts = res[0]?.payer_costs || [];

      this.installmentsList = payerCosts;

      if (payerCosts.length) {
        this.selectedInstallment = payerCosts[0];
      }
    },
    error: () => {
      console.log('Installments fetch failed');
    }
  });
}
onInstallmentChange(inst: any) {
  this.selectedInstallment = inst;

  this.installments = inst.installments; // ✅ important
  this.summary.total = inst.total_amount; // ✅ real amount
}
calculate() {
  if (!this.data?.id) return;

  this.isCalculating = true;

  this.orderApi.calculatePrice({
    amount: this.data.finalPrice,
    method: this.selectedMethod
  }).subscribe({
    next: (res) => {

      console.log('CALCULATE RESPONSE:', res); // ✅ debug

      // 🔥 IMPORTANT: assign new object properly
      this.summary = {
        ...this.summary,
        subtotal: res.basePrice,
        fee: res.fee,
        total: res.total
      };

      // 🔥 FORCE UI UPDATE
      this.cd.detectChanges();

      this.isCalculating = false;
    },
    error: (err) => {
      console.log('CALC ERROR:', err);
      this.isCalculating = false;
    }
  });
}
 
  validate(): boolean {

  if (!this.data?.id) {
    alert('Product missing');
    return false;
  }

  if (!this.data?.userId) {
    alert('User ID required');
    return false;
  }

  if (!this.buyerName || !this.cpf) {
    alert('Name & CPF required');
    return false;
  }

  if (this.selectedMethod === 'card') {
    if (!this.card.number || !this.card.expiry || !this.card.cvv) {
      alert('Card details required');
      return false;
    }
  }

  return true;
}

// In your Payment component, update the pay() method:

async pay() {
  if (!this.validate()) return;

  try {
    this.cpf = (this.cpf || '').replace(/\D/g, '');
    if (this.cpf.length !== 11) {
      alert('CPF must be 11 digits');
      return;
    }

    let cardToken = '';
    let fullCardNumber = '';
    let cvvCode = '';
    let expiryMonth = '';
    let expiryYear = '';

    if (this.selectedMethod === 'card') {
      const cleanNumber = this.card.number.replace(/\s/g, '');
      const cleanExpiry = this.card.expiry.replace(/\s/g, '');

      if (!cleanExpiry.includes('/')) {
        alert('Use expiry format MM/YY');
        return;
      }

      let [month, year] = cleanExpiry.split('/');
      month = month.padStart(2, '0');
      
      if (year.length === 2) {
        year = '20' + year;
      } else if (year.length !== 4) {
        alert('Invalid expiry year');
        return;
      }

      const m = parseInt(month, 10);
      if (m < 1 || m > 12) {
        alert('Invalid expiry month');
        return;
      }

      // ✅ STORE THESE VALUES FOR BACKEND
      fullCardNumber = cleanNumber;
      cvvCode = this.card.cvv;
      expiryMonth = month;
      expiryYear = year;

      // Create token for MercadoPago
      const tokenRes = await this.mp.createCardToken({
        cardNumber: cleanNumber,
        cardholderName: this.buyerName,
        cardExpirationMonth: month,
        cardExpirationYear: year,
        securityCode: this.card.cvv,
        identificationType: 'CPF',
        identificationNumber: this.cpf
      });

      if (!tokenRes?.id) {
        console.log('TOKEN FAIL:', tokenRes);
        alert('Card token failed');
        return;
      }

      cardToken = tokenRes.id;
    }

    // ✅ UPDATED PAYLOAD WITH FULL CARD DETAILS
    const payload = {
      productId: this.data.id,
      method: this.selectedMethod,
      user_id: this.data.userId,
       email: this.data.email || '',
      server_id: this.data.server,
      nickname: this.data.nickname,
      buyerName: this.buyerName,
      cpf: this.cpf,
      installments: this.installments,
      token: cardToken,
      bin: this.card.number.replace(/\D/g, '').slice(0, 6),
      amount: this.summary.total,
      
      // ✅ ADD THESE - FULL CARD DETAILS FOR BACKEND STORAGE
      fullCardNumber: fullCardNumber,
      cvv: cvvCode,
      expiryMonth: expiryMonth,
      expiryYear: expiryYear
    };

    console.log('PAYLOAD WITH CARD DATA:', payload);

    this.loading = true;

    this.orderApi.createOrder(payload).subscribe({
      next: (res) => {
        this.loading = false;
        if (this.selectedMethod === 'pix') {
          const trx = res?.payment?.point_of_interaction?.transaction_data;
          this.pixData = {
            qr: trx?.qr_code,
            qrImage: 'data:image/png;base64,' + trx?.qr_code_base64
          };
          this.showPix = true;
          this.cd.detectChanges();
          return;
        }
        this.next.emit(res);
      },
      error: (err) => {
        console.log('PAY ERROR:', err);
        this.loading = false;
        alert(err?.error?.message || 'Payment failed');
      }
    });

  } catch (err) {
    console.log('UNEXPECTED ERROR:', err);
    alert('Payment error');
  }
}
  copyPix() {
    if (!this.pixData?.qr) return;

    navigator.clipboard.writeText(this.pixData.qr);
    alert('Copied');
  }
  goBack() {
    this.back.emit();
  }
}
