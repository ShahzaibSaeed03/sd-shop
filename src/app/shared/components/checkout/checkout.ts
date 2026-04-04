import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReviewOrder } from "../../../pages/review-order/review-order";
import { Payment } from "../../../pages/payment/payment";
import { SucessPayment } from "../../../pages/sucess-payment/sucess-payment";

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, ReviewOrder, Payment, SucessPayment],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  step = 1;

  goToStep(step: number) {
    this.step = step;
  }
}
