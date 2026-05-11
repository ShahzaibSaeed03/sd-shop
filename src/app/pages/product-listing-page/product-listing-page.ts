import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionBlock } from '../../shared/components/section-block/section-block';
import { TabMenu } from '../../shared/components/tab-menu/tab-menu';
import { Faq } from '../../shared/components/faq/faq';
import { AdvantagSd } from '../../shared/components/advantag-sd/advantag-sd';
import { Router } from '@angular/router';
import { ProductApi } from '../../core/services/product.api';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryApi } from '../../core/services/category.api';

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
    private categoryApi: CategoryApi,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  // 🔹 Tabs
  tabs = [
    { label: 'Top Up', value: 'topup', image: 'tabs/tab1.png' },
    { label: 'Games', value: 'games', image: 'tabs/tab2.png' },
    { label: 'Services', value: 'services', image: 'tabs/tab3.png' },
  ];

  activeTab: string = 'topup';
  sortOption: string = 'popular';

  // 🔥 PRODUCTS
  allProducts: any[] = [];

  // 🔥 CATEGORIES
  categories: any[] = [];

  ngOnInit(): void {
    // ✅ LOAD CATEGORIES
    this.getCategories();

    // ✅ CHECK QUERY PARAMS
    this.route.queryParams.subscribe((params) => {
      const categoryId = params['category'];

      if (categoryId) {
        this.getByCategory(categoryId);
      } else {
        this.getAllProducts();
      }
    });
  }

  // ✅ GET ALL CATEGORIES
// ✅ GET ALL CATEGORIES
getCategories() {
  this.categoryApi.getCategories().subscribe({
    next: (res: any) => {

      const data = res.data || [];

      this.categories = data.map((cat: any) => ({
        id: cat._id,

        // ✅ card title
        title: cat.name,

        // ✅ fallback image
        image:
          cat.image ||
          'assets/cards/card-images.png',

        // ✅ ui badges
        sold: `${cat.totalProducts || 0} Products`,
        soldCount: cat.totalProducts || 0,

        rating: 5,
        totalReviews: cat.totalProducts || 0,

        // ✅ category
        category: 'topup',

        // ✅ raw data
        raw: cat,
      }));

      console.log('MAPPED CATEGORIES:', this.categories);

      this.cdr.detectChanges();
    },

    error: (err) => {
      console.error(err);
    },
  });
}

  // ✅ GET ALL PRODUCTS
  getAllProducts() {
    this.productApi.getProducts().subscribe({
      next: (res: any) => {
        this.setProducts(res.data || []);
      },
      error: (err) => console.error(err),
    });
  }

  // ✅ GET PRODUCTS BY CATEGORY
  getByCategory(categoryId: string) {
    this.productApi.getByCategory(categoryId).subscribe({
      next: (res: any) => {
        this.setProducts(res.data || []);
      },
      error: (err) => console.error(err),
    });
  }

  // ✅ SET PRODUCTS
  setProducts(data: any[]) {
    this.allProducts = data
      .filter((p: any) => p.isActive)
      .map((p: any) => ({
        id: p._id,
        title: p.displayName || p.name,
        image: p.image || 'assets/cards/card-images.png',

        sold: `${p.sold || 0} Sold`,
        soldCount: p.sold || 0,

        rating: p.rating || 0,
        totalReviews: p.totalReviews || 0,

        category: 'topup',

        raw: p,
      }));

    console.log('PRODUCTS:', this.allProducts);

    this.cdr.detectChanges();
  }

  // 🔥 CATEGORY MAPPING
  mapCategory(p: any): string {
    return 'topup';
  }

  // ✅ FILTERED PRODUCTS
  get filteredProducts() {
    if (!this.allProducts.length) return [];

    let products = this.allProducts;

    // 🔥 SHOW ALL
    if (this.activeTab === 'topup') {
      products = this.allProducts;
    } else {
      products = this.allProducts.filter(
        (p) => p.category === this.activeTab
      );
    }

    // 🔥 SORT BY RATING
    if (this.sortOption === 'rating') {
      products = [...products].sort((a, b) => b.rating - a.rating);
    }

    // 🔥 SORT BY SOLD
    if (this.sortOption === 'sold') {
      products = [...products].sort(
        (a, b) => b.soldCount - a.soldCount
      );
    }

    return products;
  }

  // ✅ GO TO DETAILS
  goToDetails(product: any) {
    this.router.navigate(['/product-details'], {
      queryParams: {
        id: product.raw._id,
      },
    });
  }

  // 🔹 TAB CHANGE
  onTabChange(tab: string) {
    this.activeTab = tab;
  }

  // 🔹 SORT CHANGE
  onSortChange(event: any) {
    this.sortOption = event.target.value;
  }
}