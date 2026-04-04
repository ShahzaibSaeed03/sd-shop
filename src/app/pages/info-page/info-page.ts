import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-info-page',
  imports: [CommonModule,FormsModule],
  templateUrl: './info-page.html',
  styleUrl: './info-page.css',
})
export class InfoPage {

  activeIndex: number | null = 0;

  faqs = [
    {
      title: 'What Information You Need to Top-Up Lunite in Wuthering Waves ?',
      open: true
    },
    {
      title: 'How to Find Your Wuthering Waves UID & Server ?',
      open: false
    },
    {
      title: 'How to Check Your Wuthering Waves Server ?',
      open: false
    },
    {
      title: 'How to Top Up in Wuthering Waves ?',
      open: false
    },
    {
      title: 'Pricing & Discounts With SDSHOP ?',
      open: false
    }
  ];

  toggle(index: number) {
    this.activeIndex = this.activeIndex === index ? null : index;
  }

}