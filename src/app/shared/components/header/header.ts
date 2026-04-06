import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @Input() menuItems: any[] = [];
  @Input() coins: number = 0;
  @Input() language: string = 'PT/BR';
  @Output() openLogin = new EventEmitter<'login' | 'points' | 'profile'>();
  openLoginModal() {
    this.openLogin.emit('points'); // 🔥 send type
  }


  isLoggedIn = false; // change later from API
  isLanguageModalOpen = false;

  openPointsModal() {
    if (this.isLoggedIn) {
      this.openLogin.emit('profile');
    } else {
      this.openLogin.emit('login');
    }
  }

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  openLanguageModal() {
    this.isLanguageModalOpen = !this.isLanguageModalOpen;
  }

  closeLanguageModal() {
    this.isLanguageModalOpen = false;
  }
}
