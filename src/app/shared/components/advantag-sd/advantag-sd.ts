import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-advantag-sd',
  imports: [CommonModule],
  templateUrl: './advantag-sd.html',
  styleUrl: './advantag-sd.css',
})
export class AdvantagSd {


  items = [
    {
      title: 'Lightning-Fast Reload',
      desc: 'Instant top up into your favorite games',
      icon: 'cards/icon1.png',
      highlight: true
    },
    {
      title: 'Safest Top Ups',
      desc: 'Every transaction is protected in an ironclad fortress',
      icon: 'cards/icon2.png'
    },
    {
      title: 'Games Galore',
      desc: 'More than 50 games available. No boring games',
      icon: 'cards/icon3.png'
    },
    {
      title: 'Best Game Credits',
      desc: 'Instant top up into your favorite games',
      icon: 'cards/icon4.png'
    },
    {
      title: 'Get Rewarded Everytime',
      desc: 'Save more as you buy SD Shop Credits',
      icon: 'cards/icon5.png'
    },
    {
      title: 'Convenient Payment',
      desc: 'Save more as you buy SD Shop Credits',
      icon: 'cards/icon6.png'
    }
  ];


}
