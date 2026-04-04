import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionBlock } from '../../shared/components/section-block/section-block';
import { TabMenu } from '../../shared/components/tab-menu/tab-menu';
import { Faq } from "../../shared/components/faq/faq";
import { AdvantagSd } from "../../shared/components/advantag-sd/advantag-sd";
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-listing-page',
  imports: [CommonModule, TabMenu, SectionBlock, Faq, AdvantagSd],
  templateUrl: './product-listing-page.html',
  styleUrl: './product-listing-page.css',
})
export class ProductListingPage {
constructor(private router: Router) {}

goToDetails(product: any) {
  this.router.navigate(['/product-details'], {
    queryParams: { name: product.title }
  });
}
  // 🔹 Tabs (same as home)
tabs = [
  { label: 'Top Up', value: 'topup', image: 'tabs/tab1.png' },
  { label: 'Games', value: 'games', image: 'tabs/tab2.png' },
  { label: 'Services', value: 'services', image: 'tabs/tab3.png' }
];

  activeTab: string = 'topup';

  sortOption: string = 'popular';

  // 🔹 DATA
  allProducts = this.generateProducts(30);

  // 🔹 FILTERED PRODUCTS
  get filteredProducts() {
    let products = this.allProducts.filter(p => p.category === this.activeTab);

    if (this.sortOption === 'rating') {
      products = products.sort((a, b) => b.rating - a.rating);
    }

    if (this.sortOption === 'sold') {
      products = products.sort((a, b) => b.soldCount - a.soldCount);
    }

    return products;
  }

  // 🔹 GENERATOR
  generateProducts(count: number) {
    return Array.from({ length: count }, (_, i) => ({
      title: `Game ${i + 1}`,
      image: 'cards/card-images.png',
      sold: `${100 + i}k+ Sold`,
      soldCount: 100 + i,
      rating: +(4.5 + (i % 5) * 0.1).toFixed(1),
      category: i % 3 === 0 ? 'topup' : i % 3 === 1 ? 'games' : 'services'
    }));
  }

  // 🔹 EVENTS
  onTabChange(tab: string) {
    this.activeTab = tab;
  }

  onSortChange(event: any) {
    this.sortOption = event.target.value;
  }
}