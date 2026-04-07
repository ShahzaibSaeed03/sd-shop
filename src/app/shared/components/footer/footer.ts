import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  links = ['About Us', 'FAQs'];
  isSupportOpen = false;

  hotSelling = [
    'Honkai: Star Rail',
    'Genshin Impact',
    'Zenless Zone Zero',
    'Wuthering Waves'
  ];

  languages = [
    {
      name: 'Brasil (Português) / BRL',
      flag: 'https://flagcdn.com/w20/br.png'
    },
    {
      name: 'United States (English) / USD',
      flag: 'https://flagcdn.com/w20/us.png'
    }
  ];

  selectedLanguage = this.languages[0];
  isDropdownOpen = false;

  // Toggle dropdown
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Select language
  selectLanguage(lang: any) {
    this.selectedLanguage = lang;
    this.isDropdownOpen = false;
  }

  // Click outside close
  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    const target = event.target as HTMLElement;

    if (!target.closest('.lang-dropdown')) {
      this.isDropdownOpen = false;
    }
  }
}
