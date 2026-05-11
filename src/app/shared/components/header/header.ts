import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUser(); // ✅ Always try loading user from localStorage
    if (this.isLoggedIn) {
      this.loadCashback();
    }
  }

  // ✅ User type — localStorage ke fields ke mutabiq
  user: {
    name?: string;
    email?: string;
    cashbackPoints?: number;
    googleId?: string;
    _id?: string;
  } | null = null;

  // ✅ localStorage se user load karo
  loadUser() {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        this.user = JSON.parse(stored);
        // Cashback points bhi yahin se le lo
        if (this.user?.cashbackPoints !== undefined) {
          this.coins = this.user.cashbackPoints;
        }
      }
    } catch (e) {
      console.error('Failed to parse user from localStorage', e);
      this.user = null;
    }
  }

  loadCashback() {
    this.authService.getCashback().subscribe({
      next: (res: any) => {
        this.coins = res.points || res.cashbackPoints || 0;
      },
      error: () => {
        this.coins = this.user?.cashbackPoints || 0;
      }
    });
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // BRL conversion (100 pontos = R$1,00)
  get coinsInBRL(): string {
    return (this.coins / 100).toFixed(2).replace('.', ',');
  }

  // ✅ Avatar — Google profile picture URL banao googleId se
  // Note: Google profile picture sirf googleId se directly nahi milti.
  // Backend se ya login response se picture URL save karna chahiye.
  // Filhal initials-based avatar use karte hain fallback ke liye.
  get userAvatar(): string {
    return 'login/user.png'; // default fallback
  }

  // ✅ User initials (agar picture na ho)
  get userInitials(): string {
    if (!this.user?.name) return 'U';
    const parts = this.user.name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  // ✅ NAME TRUNCATE LOGIC (client requirement)
  // 1. Full name <= 9 chars → full name dikhao
  // 2. Long hai → first name try karo
  // 3. First name bhi > 9 → "Eduar…" style truncate
  get displayName(): string {
    if (!this.user?.name) return 'Usuário';

    const fullName = this.user.name.trim();
    const MAX_LENGTH = 9;

    if (fullName.length <= MAX_LENGTH) {
      return fullName;
    }

    const firstName = fullName.split(' ')[0];
    if (firstName.length <= MAX_LENGTH) {
      return firstName;
    }

    return firstName.substring(0, MAX_LENGTH - 1) + '…';
  }

  @Input() menuItems: any[] = [];
  @Input() coins: number = 0;
  @Input() language: string = 'PT/BR';
  @Output() openLogin = new EventEmitter<'login' | 'points' | 'profile'>();

  isLanguageModalOpen = false;
  isMenuOpen = false;
  isCashbackOpen = false;
  isProfileOpen = false;

  currencies = [
    { code: 'BRL', name: 'Real Brasileiro', flag: 'https://flagcdn.com/w20/br.png' }
  ];
  languages = [
    { code: 'pt-BR', name: 'Português (Brasil)' }
  ];

  selectedCurrency = this.currencies[0];
  selectedLanguage = this.languages[0];

  openLoginModal() {
    this.openLogin.emit('login');
  }

  toggleProfile(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.isLoggedIn) {
      this.isProfileOpen = !this.isProfileOpen;
    } else {
      this.openLogin.emit('login');
    }
  }

  closeProfile() {
    this.isProfileOpen = false;
  }

  logout() {
    this.authService.logout?.();
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // agar token bhi save hai
    this.user = null;
    this.coins = 0;
    this.isProfileOpen = false;
    window.location.reload();
  }

  toggleCashback(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isCashbackOpen = !this.isCashbackOpen;
  }

  closeCashback() {
    this.isCashbackOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.cashback-wrapper')) {
      this.isCashbackOpen = false;
    }
    if (!target.closest('.profile-wrapper')) {
      this.isProfileOpen = false;
    }
    if (!target.closest('.lang-dropdown')) {
      this.isLanguageModalOpen = false;
    }
  }

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

  applyLanguage() {
    this.isLanguageModalOpen = false;
  }
}