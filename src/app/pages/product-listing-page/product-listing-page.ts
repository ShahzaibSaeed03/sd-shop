import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionBlock } from '../../shared/components/section-block/section-block';
import { TabMenu } from '../../shared/components/tab-menu/tab-menu';
import { Faq } from "../../shared/components/faq/faq";
import { AdvantagSd } from "../../shared/components/advantag-sd/advantag-sd";
import { Router } from '@angular/router';
import { ProductApi } from '../../core/services/product.api';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-product-listing-page',
  standalone: true,
  imports: [CommonModule, TabMenu, SectionBlock, Faq, AdvantagSd],
  templateUrl: './product-listing-page.html',
})
export class ProductListingPage implements OnInit {

  constructor(
    private router: Router,
    private productApi: ProductApi,
    private cdr: ChangeDetectorRef
  ) { }

  // 🔹 Tabs
  tabs = [
    { label: 'Top Up', value: 'topup', image: 'tabs/tab1.png' },
    { label: 'Games', value: 'games', image: 'tabs/tab2.png' },
    { label: 'Services', value: 'services', image: 'tabs/tab3.png' }
  ];

  activeTab: string = 'topup';
  sortOption: string = 'popular';

  // 🔥 REAL DATA
  allProducts: any[] = [];

  ngOnInit(): void {
    this.getProducts();
  }

  // ✅ API CALL
  getProducts() {
    this.productApi.getProducts().subscribe({
      next: (res: any) => {

        const data = res.data || [];

        this.allProducts = data
          .filter((p: any) => p.isActive) // ✅ important
          .map((p: any) => ({
            id: p._id,
            title: p.displayName || p.name,
            image: p.image || 'assets/cards/card-images.png',
            sold: '0 Sold',
            soldCount: 0,
            rating: 0,

            // ✅ FIX
            category: 'topup',

            // 🔥 keep raw
            raw: p
          }));
        this.activeTab = 'topup';
        this.cdr.detectChanges();
        console.log('PRODUCTS:', this.allProducts); // debug

      },
      error: (err) => console.error(err)
    });
  }

  // 🔥 CATEGORY MAPPING (IMPORTANT)
  mapCategory(p: any): string {
    return 'topup'; // ✅ FIX
  }

  // 🔹 FILTER
  get filteredProducts() {
    if (!this.allProducts.length) return [];

    let products = this.allProducts;

    // ✅ Only filter if category exists
    if (this.activeTab === 'topup') {
      products = this.allProducts; // 🔥 show all
    } else {
      products = this.allProducts.filter(p => p.category === this.activeTab);
    }

    if (this.sortOption === 'rating') {
      products = [...products].sort((a, b) => b.rating - a.rating);
    }

    if (this.sortOption === 'sold') {
      products = [...products].sort((a, b) => b.soldCount - a.soldCount);
    }

    return products;
  }

  // 🔹 NAVIGATION
goToDetails(product: any) {
  this.router.navigate(['/product-details'], {
    queryParams: { id: product.raw._id } // ✅ SAME AS HOME
  });
}

  // 🔹 EVENTS
  onTabChange(tab: string) {
    this.activeTab = tab;
  }

  onSortChange(event: any) {
    this.sortOption = event.target.value;
  }
}