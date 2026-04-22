import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateOrderResponse, OrderApi } from '../../core/services/order.api';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-payment',
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
})
export class Payment implements OnInit {

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
  constructor(private orderApi: OrderApi, private cd: ChangeDetectorRef
  ) { }
  ngOnInit() {
    if (!this.data) return;




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
  calculate() {
    if (!this.data?.id) return;

    this.isCalculating = true;

    this.orderApi.calculatePrice({
      productId: this.data.id,
      method: this.selectedMethod
    }).subscribe({
      next: (res) => {

        this.summary = {
          subtotal: res.basePrice,
          fee: res.fee,
          discount: 0,
          total: res.total,
          coupon: this.data.coupon || '-',
          userId: this.data.userId,
          server: this.data.server,
          nickname: this.data.nickname
        };

        this.isCalculating = false;
      },
      error: () => this.isCalculating = false
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

    return true;
  }

  pay() {
    if (!this.validate()) return;

    const payload = {
      productId: this.data.id,
      method: this.selectedMethod,
      user_id: this.data.userId,
      server_id: this.data.server,
      nickname: this.data.nickname
    };

    this.loading = true;

    this.orderApi.createOrder(payload).subscribe({
      next: (res) => {
        this.loading = false;

        if (this.selectedMethod === 'pix') {

          const trx = res?.payment?.point_of_interaction?.transaction_data;

          if (!trx) {
            alert('QR not found');
            return;
          }

          this.pixData = {
            qr: trx.qr_code,
            qrImage: 'data:image/png;base64,' + trx.qr_code_base64
          };

          this.showPix = true;

          // ✅ ADD HERE
          this.cd.detectChanges();

          return;
        }

        this.next.emit(res);
      },
      error: () => {
        this.loading = false;
        alert('Payment failed');
      }
    });
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
