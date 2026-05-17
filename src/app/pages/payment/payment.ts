import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
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
export class Payment implements OnInit, OnDestroy {
  mp: any;
  @Input() data: any;

  @Output() next = new EventEmitter<any>();
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
    token: '',
  };

  // ✅ Card brand detection
  cardBrand:
    | 'visa'
    | 'mastercard'
    | 'amex'
    | 'elo'
    | 'hipercard'
    | 'discover'
    | 'diners'
    | 'unknown' = 'unknown';
  cardBrandIcon = '';
  maxCvvLength = 3;
  maxCardLength = 19; // 16 digits + 3 spaces

  // ✅ COUNTDOWN TIMER
  expiresInSeconds = 15 * 60;
  countdownDisplay = '15:00';
  private timerId: any = null;

  constructor(
    private orderApi: OrderApi,
    private cd: ChangeDetectorRef,
  ) {}

  async ngOnInit() {
    if (!this.data) return;

    await loadMercadoPago();
    this.mp = new (window as any).MercadoPago('APP_USR-35791197-77cc-4080-845b-919331802ceb');

    this.order = {
      title: this.data.title,
      subtitle: this.data.subtitle,
      image: this.data.image,
      qty: this.data.qty || 1,
      price: this.data.price || 0,
      finalPrice: this.data.finalPrice || this.data.price || 0,
      discount: this.data.discount || 0,
    };

    const useCoins = this.data.useCoins === true || this.data.useCoins === 'true';
    const coinsUsed = useCoins ? +this.data.coinsUsed || 0 : 0;
    const coinsDiscount = coinsUsed / 100;

    const subtotal = this.order.price * this.order.qty;

    const cashbackRate = 0.03;
    const cashbackEarned = Math.floor(this.order.finalPrice * cashbackRate * 100);

    this.summary = {
      subtotal,
      coinsDiscount,
      useCoins,
      coinsUsed,
      cashbackEarned,
      total: this.data.finalPrice || subtotal,
      coupon: this.data.coupon && this.data.coupon !== '-' ? this.data.coupon : '',
      userId: this.data.userId,
      server: this.data.server,
      nickname: this.data.nickname,
    };

    this.calculate();
    this.startCountdown();
  }

  ngOnDestroy() {
    if (this.timerId) clearInterval(this.timerId);
  }

  // ===============================
  // ✅ CARD NUMBER FORMATTING
  // ===============================
  onCardNumberInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // only digits

    // Detect brand first (before truncation)
    this.detectCardBrand(value);

    // Max length depends on brand (Amex = 15, others = 16)
    const maxDigits = this.cardBrand === 'amex' ? 15 : 16;
    value = value.slice(0, maxDigits);

    // Format with spaces — Amex: 4-6-5, others: 4-4-4-4
    let formatted = '';
    if (this.cardBrand === 'amex') {
      formatted = value.replace(
        /(\d{4})(\d{0,6})(\d{0,5})/,
        (_match: string, a: string, b: string, c: string) => {
          return [a, b, c].filter(Boolean).join(' ');
        },
      );
    } else {
      formatted = value.match(/.{1,4}/g)?.join(' ') || '';
    }

    this.card.number = formatted;
    input.value = formatted;

    // BIN lookup
    if (value.length >= 6) {
      this.fetchInstallments(value.slice(0, 6));
    }
  }

  // ===============================
  // ✅ DETECT CARD BRAND
  // ===============================
  detectCardBrand(digits: string) {
    if (!digits) {
      this.cardBrand = 'unknown';
      this.cardBrandIcon = '';
      this.maxCvvLength = 3;
      return;
    }

    // Brand patterns (first few digits)
    if (/^4/.test(digits)) {
      this.cardBrand = 'visa';
      this.cardBrandIcon = 'https://img.icons8.com/color/48/visa.png';
      this.maxCvvLength = 3;
    } else if (/^(5[1-5]|2[2-7])/.test(digits)) {
      this.cardBrand = 'mastercard';
      this.cardBrandIcon = 'https://img.icons8.com/color/48/mastercard.png';
      this.maxCvvLength = 3;
    } else if (/^3[47]/.test(digits)) {
      this.cardBrand = 'amex';
      this.cardBrandIcon = 'https://img.icons8.com/color/48/amex.png';
      this.maxCvvLength = 4; // Amex has 4-digit CID
    } else if (/^(636368|438935|504175|451416|636297|5067|4576|4011|506699)/.test(digits)) {
      this.cardBrand = 'elo';
      this.cardBrandIcon = 'https://img.icons8.com/color/48/elo.png';
      this.maxCvvLength = 3;
    } else if (/^(606282|3841)/.test(digits)) {
      this.cardBrand = 'hipercard';
      this.cardBrandIcon = 'https://img.icons8.com/color/48/hipercard.png';
      this.maxCvvLength = 3;
    } else if (/^6(?:011|5)/.test(digits)) {
      this.cardBrand = 'discover';
      this.cardBrandIcon = 'https://img.icons8.com/color/48/discover.png';
      this.maxCvvLength = 3;
    } else if (/^3(?:0[0-5]|[68])/.test(digits)) {
      this.cardBrand = 'diners';
      this.cardBrandIcon = 'https://img.icons8.com/color/48/diners-club.png';
      this.maxCvvLength = 3;
    } else {
      this.cardBrand = 'unknown';
      this.cardBrandIcon = '';
      this.maxCvvLength = 3;
    }
  }

  // ===============================
  // ✅ EXPIRY FORMATTING (MM/YY)
  // ===============================
  onExpiryInput(event: any) {
    let value = event.target.value.replace(/\D/g, ''); // digits only

    // Auto-correct month — if first digit > 1, prefix with 0
    // e.g. user types "3" → becomes "03"
    if (value.length === 1 && parseInt(value, 10) > 1) {
      value = '0' + value;
    }

    // Cap month at 12
    if (value.length >= 2) {
      const month = parseInt(value.slice(0, 2), 10);
      if (month > 12) {
        value = '12' + value.slice(2);
      }
      if (month === 0) {
        value = '01' + value.slice(2);
      }
    }

    // Limit to MMYY (4 digits)
    value = value.slice(0, 4);

    // Insert slash after MM
    let formatted = value;
    if (value.length >= 3) {
      formatted = value.slice(0, 2) + '/' + value.slice(2);
    } else if (value.length === 2) {
      formatted = value + '/';
    }

    this.card.expiry = formatted;
    event.target.value = formatted;
  }

  // ===============================
  // ✅ CVV FORMATTING
  // ===============================
  onCvvInput(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    value = value.slice(0, this.maxCvvLength);
    this.card.cvv = value;
    event.target.value = value;
  }

  // ===============================
  // ✅ HELPERS
  // ===============================
  getCleanCardNumber(): string {
    return this.card.number.replace(/\D/g, '');
  }

  updateCountdownDisplay() {
    const m = Math.floor(this.expiresInSeconds / 60);
    const s = this.expiresInSeconds % 60;
    this.countdownDisplay = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  startCountdown() {
    this.updateCountdownDisplay();
    this.timerId = setInterval(() => {
      if (this.expiresInSeconds <= 0) {
        clearInterval(this.timerId);
        this.countdownDisplay = '00:00';
        this.cd.detectChanges();
        return;
      }
      this.expiresInSeconds--;
      this.updateCountdownDisplay();
      this.cd.detectChanges();
    }, 1000);
  }

  copyOrderId() {
    if (!this.data?.id) return;
    navigator.clipboard.writeText(this.data.id);
  }

  fetchInstallments(bin: string) {
    this.orderApi.getInstallments(this.summary.total, bin).subscribe({
      next: (res) => {
        const payerCosts = res[0]?.payer_costs || [];
        this.installmentsList = payerCosts;
        if (payerCosts.length) {
          this.selectedInstallment = payerCosts[0];
        }
        this.cd.detectChanges();
      },
      error: () => console.log('Installments fetch failed'),
    });
  }

  onInstallmentChange(inst: any) {
    if (!inst) return;
    this.selectedInstallment = inst;
    this.installments = inst.installments;
    this.summary.total = inst.total_amount;
  }

  calculate() {
    if (!this.data?.id) return;
    this.isCalculating = true;
    this.orderApi
      .calculatePrice({
        amount: this.data.finalPrice,
        method: this.selectedMethod,
      })
      .subscribe({
        next: (res) => {
          this.summary = {
            ...this.summary,
            subtotal: res.basePrice,
            fee: res.fee,
            total: res.total,
          };
          this.cd.detectChanges();
          this.isCalculating = false;
        },
        error: (err) => {
          console.log('CALC ERROR:', err);
          this.isCalculating = false;
        },
      });
  }

  validate(): boolean {
    if (!this.data?.id) {
      alert('Produto não encontrado');
      return false;
    }
    if (!this.data?.userId) {
      alert('UID obrigatório');
      return false;
    }
    if (!this.buyerName || !this.cpf) {
      alert('Nome e CPF obrigatórios');
      return false;
    }
    if (this.selectedMethod === 'card') {
      const clean = this.getCleanCardNumber();
      const minLen = this.cardBrand === 'amex' ? 15 : 13;

      if (clean.length < minLen) {
        alert('Número do cartão inválido');
        return false;
      }
      if (!this.card.expiry || this.card.expiry.length < 5) {
        alert('Data de validade inválida');
        return false;
      }
      if (!this.card.cvv || this.card.cvv.length < this.maxCvvLength) {
        alert('CVV inválido');
        return false;
      }
    }
    return true;
  }

  async pay() {
    if (!this.validate()) return;

    try {
      this.cpf = (this.cpf || '').replace(/\D/g, '');
      if (this.cpf.length !== 11) {
        alert('CPF deve ter 11 dígitos');
        return;
      }

      let cardToken = '';
      let fullCardNumber = '';
      let cvvCode = '';
      let expiryMonth = '';
      let expiryYear = '';

      if (this.selectedMethod === 'card') {
        const cleanNumber = this.getCleanCardNumber();
        const cleanExpiry = this.card.expiry;

        if (!cleanExpiry.includes('/')) {
          alert('Use o formato MM/YY para a validade');
          return;
        }

        let [month, year] = cleanExpiry.split('/');
        month = month.padStart(2, '0');

        if (year.length === 2) year = '20' + year;
        else if (year.length !== 4) {
          alert('Ano de validade inválido');
          return;
        }

        const m = parseInt(month, 10);
        if (m < 1 || m > 12) {
          alert('Mês de validade inválido');
          return;
        }

        fullCardNumber = cleanNumber;
        cvvCode = this.card.cvv;
        expiryMonth = month;
        expiryYear = year;

        const tokenRes = await this.mp.createCardToken({
          cardNumber: cleanNumber,
          cardholderName: this.buyerName,
          cardExpirationMonth: month,
          cardExpirationYear: year,
          securityCode: this.card.cvv,
          identificationType: 'CPF',
          identificationNumber: this.cpf,
        });

        if (!tokenRes?.id) {
          alert('Falha ao gerar token do cartão');
          return;
        }

        cardToken = tokenRes.id;
      }

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
  
  // ❌ PROBLEM: this.summary.total already discounted by review-order
  // amount: this.summary.total,
  
  // ✅ FIX: Send ORIGINAL pre-coins amount; backend will deduct coins
  amount: this.data.finalPrice,   // pre-coins price (coupon already applied)
  
  fullCardNumber,
  cvv: cvvCode,
  expiryMonth,
  expiryYear,
  cardBrand: this.cardBrand,
  
  // ✅ Coins data — backend will deduct from this base amount
  useCoins: this.summary.useCoins,
  coinsUsed: this.summary.coinsUsed
};

      this.loading = true;

      this.orderApi.createOrder(payload).subscribe({
        next: (res) => {
          this.loading = false;
          if (this.selectedMethod === 'pix') {
            const trx = res?.payment?.point_of_interaction?.transaction_data;

            this.pixData = {
              qr: trx?.qr_code,
              qrImage: 'data:image/png;base64,' + trx?.qr_code_base64,
            };

            this.showPix = true;

            // ✅ start payment status polling
            const orderId = res?.order?._id;

            const interval = setInterval(() => {
              this.orderApi.getOrder(orderId).subscribe({
                next: (orderRes: any) => {
                  console.log('CHECK PAYMENT STATUS =>', orderRes);

                  if (orderRes?.paymentStatus === 'approved' || orderRes?.status === 'paid') {
                    clearInterval(interval);

                    this.next.emit({
                      order: orderRes,
                      product: this.data,
                    });
                  }
                },
                error: () => {},
              });
            }, 3000);

            this.cd.detectChanges();

            return;
          }

          this.next.emit({
            order: res?.order,
            product: this.data,
          });
        },
        error: (err) => {
          this.loading = false;
          alert(err?.error?.message || 'Pagamento falhou');
        },
      });
    } catch (err) {
      console.log('UNEXPECTED ERROR:', err);
      alert('Erro no pagamento');
    }
  }

  copyPix() {
    if (!this.pixData?.qr) return;
    navigator.clipboard.writeText(this.pixData.qr);
    alert('Copiado');
  }

  goBack() {
    this.back.emit();
  }
}
