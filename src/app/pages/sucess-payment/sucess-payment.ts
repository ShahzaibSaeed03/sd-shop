import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sucess-payment',
  imports: [],
  templateUrl: './sucess-payment.html',
  styleUrl: './sucess-payment.css',
})
export class SucessPayment {

  @Input() order: any;

}