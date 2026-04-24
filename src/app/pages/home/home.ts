import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Slider } from '../../shared/components/slider/slider';
import { TabMenu } from '../../shared/components/tab-menu/tab-menu';
import { SectionBlock } from '../../shared/components/section-block/section-block';
import { CommonModule } from '@angular/common';
import { Faq } from '../../shared/components/faq/faq';
import { AdvantagSd } from '../../shared/components/advantag-sd/advantag-sd';
import { Router } from '@angular/router';
import { SectionApi } from '../../core/services/section.api';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Slider, TabMenu, SectionBlock, CommonModule, Faq, AdvantagSd],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  constructor(
    private router: Router,
    private sectionApi: SectionApi,
    private cdr: ChangeDetectorRef,
  ) {}

  // ✅ Tabs
  tabs: any[] = [{ label: 'All', value: 'all' }];
  activeTab: string = 'all';

  // ✅ Data
  sections: any[] = [];
  allSections: any[] = []; // 🔥 store full data

  ngOnInit(): void {
    this.getSections();
  }

  // ==========================
  // ✅ API CALL (ONLY ONCE)
  // ==========================
  getSections() {
    this.sectionApi.getFrontendSections().subscribe({
      next: (res: any) => {
        const data = res.data || res;

        // ✅ FORMAT DATA
        this.allSections = data
          .filter((s: any) => s.isActive)
          .sort((a: any, b: any) => a.order - b.order)
          .map((section: any) => ({
            name: section.name,
            apiSource: section.apiSource,
            mode: section.mode,
            items: this.mapItems(section.items || []),
          }));

        // ✅ BUILD UNIQUE TABS
        const uniqueNames = [...new Set(this.allSections.map((s) => s.name))];

        this.tabs = [
          { label: 'All', value: 'all' },
          ...uniqueNames.map((name) => ({
            label: name,
            value: name,
          })),
        ];

        // ✅ DEFAULT → SHOW ALL
        this.sections = this.allSections;

        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  // ==========================
  // ✅ FILTER (NO API CALL)
  // ==========================
  onTabChange(tab: string) {
    this.activeTab = tab;

    if (tab === 'all') {
      this.sections = this.allSections;
    } else {
      this.sections = this.allSections.filter((s) => s.name === tab);
    }
  }

  // ==========================
  // ✅ MAP ITEMS
  // ==========================
mapItems(items: any[]) {
  return items.map(item => ({
    title: item.displayName || item.name || 'No Title',
    image: item.image || 'cards/card-images.png',
    price: item.price,

    rating: Number(item.rating || 0),
    sold: `${item.sold || 0} Sold`,
    soldCount: Number(item.sold || 0),

    raw: item
  }));
}

  // ==========================
  // ✅ NAVIGATION
  // ==========================
  goToProduct(product: any) {
    this.router.navigate(['/product-details'], {
      queryParams: { id: product.raw._id },
    });
  }
}
