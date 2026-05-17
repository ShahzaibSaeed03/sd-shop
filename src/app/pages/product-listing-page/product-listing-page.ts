import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionBlock } from '../../shared/components/section-block/section-block';
import { TabMenu } from '../../shared/components/tab-menu/tab-menu';
import { Faq } from '../../shared/components/faq/faq';
import { AdvantagSd } from '../../shared/components/advantag-sd/advantag-sd';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CategoryApi } from '../../core/services/category.api';

@Component({
  selector: 'app-product-listing-page',
  standalone: true,
  imports: [CommonModule, TabMenu, SectionBlock, Faq, AdvantagSd, RouterLink],
  templateUrl: './product-listing-page.html',
})
export class ProductListingPage implements OnInit {

  constructor(
    private router: Router,
    private categoryApi: CategoryApi,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  // ✅ Tabs — Portuguese
  tabs = [
    { label: 'Top Ups', value: 'topup', image: 'tabs/tab1.png' },
    { label: 'Moedas', value: 'moedas', image: 'tabs/tab2.png' },
    { label: 'Vouchers', value: 'vouchers', image: 'tabs/tab3.png' },
  ];

  activeTab: string = 'topup';

  // ✅ Sort dropdown state
  sortOption: string = 'popular';
  isSortOpen: boolean = false;

  sortOptions = [
    { value: 'popular', label: 'Mais Populares' },
    { value: 'rating', label: 'Melhor Avaliados' },
    { value: 'sold', label: 'Mais Vendidos' },
  ];

  // ✅ Categories data
  allCategories: any[] = [];

  // Loading/Error states
  isLoading: boolean = false;
  errorMessage: string = '';

  ngOnInit(): void {
    this.loadCategories();
  }

  // ✅ Load all categories (games) from backend
  loadCategories(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.categoryApi.getCategories().subscribe({
      next: (res: any) => {
        // Backend response handle karo — kabhi `res.data`, kabhi direct array
        const data = Array.isArray(res) ? res : (res?.data || res?.categories || []);
        console.log('Categories loaded:', data); // debug ke liye
        this.setCategories(data);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load categories:', err);
        this.errorMessage = 'Erro ao carregar jogos. Tente novamente.';
        this.isLoading = false;
        this.allCategories = [];
        this.cdr.detectChanges();
      },
    });
  }

  // ✅ Map backend categories to UI format
  setCategories(data: any[]): void {
    if (!Array.isArray(data) || data.length === 0) {
      this.allCategories = [];
      return;
    }

    this.allCategories = data
      .filter((c: any) => c?.isActive !== false)
      .map((c: any) => ({
        id: c._id,
        title: c.displayName || c.name || 'Untitled',
        image: c.image || 'assets/cards/card-images.png',
        sold: `${this.formatSold(c.totalSold || c.sold || 0)} Vendidos`,
        soldCount: c.totalSold || c.sold || 0,
        rating: c.rating || 0,
        totalReviews: c.totalReviews || 0,
        category: c.type || 'topup',
        raw: c,
      }));
  }

  // ✅ Format sold count (e.g. 1500 → "1.5K", 1000000 → "1M+")
  private formatSold(count: number): string {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1).replace('.0', '') + 'M+';
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1).replace('.0', '') + 'K+';
    }
    return count.toString();
  }

  // 🔹 Filtered + Sorted categories
  get filteredCategories(): any[] {
    if (!this.allCategories.length) return [];

    let items = [...this.allCategories];

    // Tab filter
    if (this.activeTab !== 'topup') {
      items = items.filter((c) => c.category === this.activeTab);
    }

    // Sort
    if (this.sortOption === 'rating') {
      items.sort((a, b) => b.rating - a.rating);
    } else if (this.sortOption === 'sold') {
      items.sort((a, b) => b.soldCount - a.soldCount);
    }

    return items;
  }

  // ✅ Breadcrumb label
  get currentTabLabel(): string {
    return this.tabs.find(t => t.value === this.activeTab)?.label || 'Top Ups';
  }

  // ✅ Sort button label
  get currentSortLabel(): string {
    return this.sortOptions.find(o => o.value === this.sortOption)?.label || 'Mais Populares';
  }

  // ✅ Game pe click → product detail page khole
 goToDetails(category: any): void {

  const slug = category?.raw?.slug;

  if (!slug) {
    console.warn('No category slug found', category);
    return;
  }

  this.router.navigate([
    '/product',
    slug
  ]);

}

  // 🔹 Tab change
  onTabChange(tab: string): void {
    this.activeTab = tab;
  }

  // ✅ Sort dropdown handlers
  toggleSort(): void {
    this.isSortOpen = !this.isSortOpen;
  }

  selectSort(value: string): void {
    this.sortOption = value;
    this.isSortOpen = false;
  }
}