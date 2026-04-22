import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule,RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  constructor(private authService: AuthService) {}
  

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  @Input() menuItems: any[] = [];
  @Input() coins: number = 0;
  @Input() language: string = 'PT/BR';
  @Output() openLogin = new EventEmitter<'login' | 'points' | 'profile'>();

  openLoginModal() {
    this.openLogin.emit('points');
  }

  openPointsModal() {
    if (this.isLoggedIn) {
      this.openLogin.emit('profile');
    } else {
      this.openLogin.emit('login');
    }
  }

  isLanguageModalOpen = false;
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
