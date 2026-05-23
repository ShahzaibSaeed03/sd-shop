import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Slider } from '../../shared/components/slider/slider';
import { TabMenu } from '../../shared/components/tab-menu/tab-menu';
import { SectionBlock } from '../../shared/components/section-block/section-block';
import { CommonModule } from '@angular/common';
import { Faq } from '../../shared/components/faq/faq';
import { AdvantagSd } from '../../shared/components/advantag-sd/advantag-sd';
import { Router } from '@angular/router';
import { SectionApi } from '../../core/services/section.api';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Slider, TabMenu, SectionBlock, CommonModule, Faq, AdvantagSd],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  constructor(
    private router: Router,
    private sectionApi: SectionApi,
    private cdr: ChangeDetectorRef,
  ) {}

  // ==========================
  // ✅ STATIC TABS (WITH ICONS)
  // ==========================
  tabs = [
    {
      label: 'Top Up',
      value: 'topup',
      image: 'tabs/tab1.png',
    },
    {
      label: 'Moedas',
      value: 'coins',
      image: 'tabs/tab2.png',
    },
    {
      label: 'Gift Cards',
      value: 'gift',
      image: 'gift-box.png',
    },
    {
      label: 'Vouchers',
      value: 'voucher',
      image: 'tabs/tab4.png',
    },
    {
      label: 'Itens',
      value: 'items',
      image: 'tabs/tab5.png',
    },
  ];

  activeTab: string = 'topup';

  // ==========================
  // ✅ DATA
  // ==========================
  sections: any[] = [];
  allSections: any[] = [];

  // ==========================
  // ✅ INIT
  // ==========================
  ngOnInit(): void {
    this.getSections();
  }

  // ==========================
  // ✅ API CALL
  // ==========================
  getSections() {
    this.sectionApi.getFrontendSections().subscribe({
      next: (res: any) => {
        const data = res.data || res;

        this.allSections = data.map((section: any) => ({
          name: section.name,

          subtitle: section.subtitle,

          tabKey: section.tabKey,

          apiSource: section.apiSource,

          isSpecial: section.isSpecial,

          specialTitle: section.specialTitle,

          specialSubtitle: section.specialSubtitle,

          items: this.mapItems(section.items || []),
        }));

        // default tab
        this.sections = this.allSections;

        this.cdr.markForCheck();
      },
      error: (err) => console.error(err),
    });
  }

  // ==========================
  // ✅ TAB FILTER
  // ==========================
  onTabChange(tab: string) {
    this.activeTab = tab;

    if (tab === 'topup') {
      this.sections = this.allSections;
    } else {
      this.sections = this.allSections.filter((s) => s.tabKey === tab);
    }

    this.cdr.markForCheck();
  }

  // ==========================
  // ✅ MAP ITEMS
  // ==========================
  mapItems(items: any[]) {
    return items.map((item) => ({
      title: item.name,

      image: item.image || 'cards/card-images.png',

      slug: item.slug,

      // ✅ NEW
      rating: item.averageRating || 0,

      totalReviews: item.totalReviews || 0,

      soldCount: item.totalSold || 0,

      sold: `${this.formatSold(item.totalSold || 0)} Vendidos`,

      raw: item,
    }));
  }
  private formatSold(count: number): string {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1).replace('.0', '') + 'M+';
    }

    if (count >= 1000) {
      return (count / 1000).toFixed(1).replace('.0', '') + 'K+';
    }

    return count.toString();
  }

  // ==========================
  // ✅ NAVIGATION
  // ==========================
  goToProduct(item: any) {
    this.router.navigate(['/product', item.slug]);
  }
}
