import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Component, HostListener, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  private http = inject(HttpClient);

  isSupportOpen = false;

  // Support form fields
  supportName = '';
  supportEmail = '';
  supportMessage = '';
  isSending = false;
  sendStatus: 'idle' | 'success' | 'error' = 'idle';

  // ✅ Useful Links — Portuguese with routes
  usefulLinks = [
    { label: 'Sobre Nós', route: '/about' },
    { label: 'Perguntas Frequentes', route: '/faqs' }
  ];

  // ✅ Hot Selling games (game names international rakhe — same hain Portuguese mein)
  hotSelling = [
    { label: 'Honkai: Star Rail', route: '/products/honkai-star-rail' },
    { label: 'Genshin Impact', route: '/products/genshin-impact' },
    { label: 'Zenless Zone Zero', route: '/products/zenless-zone-zero' },
    { label: 'Wuthering Waves', route: '/products/wuthering-waves' }
  ];

  // ✅ Bottom links
  bottomLinks = [
    { label: 'Termos de Serviço', route: '/terms' },
    { label: 'Política de Privacidade', route: '/privacy' },
    { label: 'Política de Reembolso', route: '/refund' }
  ];

  languages = [
    {
      name: 'Brasil (Português) / BRL',
      flag: 'https://flagcdn.com/w20/br.png'
    }
  ];

  selectedLanguage = this.languages[0];
  isDropdownOpen = false;

  openSupport(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isSupportOpen = true;
  }

  sendSupportMessage() {
    if (!this.supportName || !this.supportEmail || !this.supportMessage) {
      return;
    }

    this.isSending = true;
    this.sendStatus = 'idle';

    const payload = {
      name: this.supportName,
      email: this.supportEmail,
      message: this.supportMessage,
      _replyto: this.supportEmail,
      _subject: 'Nova mensagem de suporte - SD Shop'
    };

    const endpoint = 'https://formspree.io/f/YOUR_FORM_ID';

    this.http.post(endpoint, payload, {
      headers: { 'Accept': 'application/json' }
    }).subscribe({
      next: () => {
        this.sendStatus = 'success';
        this.isSending = false;
        this.supportName = '';
        this.supportEmail = '';
        this.supportMessage = '';
      },
      error: () => {
        this.sendStatus = 'error';
        this.isSending = false;
      }
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectLanguage(lang: any) {
    this.selectedLanguage = lang;
    this.isDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.lang-dropdown')) {
      this.isDropdownOpen = false;
    }
  }
}