import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment',
  imports: [CommonModule,FormsModule],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
})
export class Payment {
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  selectedMethod = 'card';

  pay() {
    this.next.emit();
  }

  goBack() {
    this.back.emit();
  }

}
