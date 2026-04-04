import { Component } from '@angular/core';
import { Slider } from "../../shared/components/slider/slider";
import { TabMenu } from "../../shared/components/tab-menu/tab-menu";
import { SectionBlock } from "../../shared/components/section-block/section-block";
import { CommonModule } from '@angular/common';
import { Faq } from "../../shared/components/faq/faq";
import { AdvantagSd } from "../../shared/components/advantag-sd/advantag-sd";
import { Router } from '@angular/router';
import { OrderRecord } from "../order-record/order-record";
import { Profile } from "../profile/profile";
import { NotFound } from "../not-found/not-found";
import { Review } from "../review/review";
import { InfoPage } from "../info-page/info-page";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Slider, TabMenu, SectionBlock, CommonModule, Faq, AdvantagSd,],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(private router: Router) {}

  // 🔹 TABS
  tabs = [
    { label: 'Top Up', image: 'tabs/tab1.png', value: 'topup' },
    { label: 'Game Coins', image: 'tabs/tab2.png', value: 'coins' },
    { label: 'Gift Cards', image: 'tabs/tab3.png', value: 'gifts' },
    { label: 'Game Keys', image: 'tabs/tab4.png', value: 'keys' },
    { label: 'Game Items', image: 'tabs/tab5.png', value: 'items' }
  ];

  activeTab: string = 'topup';
goToProduct(product: any) {
  this.router.navigate(['/products'], {
    queryParams: { name: product.title }
  });
}
  // 🔹 BASE DATA
  allGames = this.generateGames('Game', 20).map((g, i) => ({
    ...g,
    category: i % 2 === 0 ? 'topup' : 'coins'
  }));

  // 🔹 SECTIONS

  // Recently (5 items)
  get recentGames() {
    return this.allGames.slice(0, 5);
  }

  // Hot Selling (15 items filtered by tab)
  get hotGames() {
    return this.allGames
      .filter(g => g.category === this.activeTab)
      .slice(0, 15);
  }

  // Top Games (ONLY 4)
  topGames = this.generateGames('Top Game', 4);

  // Popular Coins (15)
  coinGames = this.generateGames('Coin Game', 15);

  // 🔹 HELPER (DYNAMIC DATA GENERATOR)
  generateGames(prefix: string, count: number) {
    return Array.from({ length: count }, (_, i) => ({
      title: `${prefix} ${i + 1}`,
      image: 'cards/card-images.png',
      sold: `${50 + i}k+ Sold`,
      rating: +(4.5 + (i % 5) * 0.1).toFixed(1)
    }));
  }

  // 🔹 EVENTS
  onTabChange(tab: string) {
    this.activeTab = tab;
  }

}