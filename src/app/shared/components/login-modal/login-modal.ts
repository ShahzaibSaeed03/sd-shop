import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-login-modal',
  imports: [CommonModule],
  templateUrl: './login-modal.html',
  styleUrl: './login-modal.css',
})
export class LoginModal {

@Input() modalType: 'points' | 'login' | 'profile' | null = null;
  @Output() onClose = new EventEmitter<void>();

  close() {
    this.modalType = null;
    this.onClose.emit();
  }

  openPoints() {
    this.modalType = 'points';
  }

  openLogin() {
    this.modalType = 'login';
  }

  login() {
    console.log('Login clicked');
  }

}