import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-sucess-payment',
  imports: [],
  templateUrl: './sucess-payment.html',
  styleUrl: './sucess-payment.css',
})
export class SucessPayment {
 order = {
    orderNumber: '0000000268',
    orderDate: '7 September 2024',
    gameName: 'PUBG Mobile',
    gameUID: '600289646',
    product: 'UC Pack x1',
    server: 'America',
    total: '$23.52',
    transactionTime: '2024/09/04 02:00 PM'
  };


}
