import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  links = ['About Us', 'FAQs'];

  hotSelling = [
    'Honkai: Star Rail',
    'Genshin Impact',
    'Zenless Zone Zero',
    'Wuthering Waves'
  ];
}
