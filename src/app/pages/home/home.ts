import { ChangeDetectorRef, Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Slider } from '../../shared/components/slider/slider';
import { TabMenu } from '../../shared/components/tab-menu/tab-menu';
import { SectionBlock } from '../../shared/components/section-block/section-block';
import { Faq } from '../../shared/components/faq/faq';
import { AdvantagSd } from '../../shared/components/advantag-sd/advantag-sd';

import { SectionApi } from '../../core/services/section.api';

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

  tabs = [
    { label: 'Top Up', value: 'topup', image: 'tabs/tab1.png' },
    { label: 'Moedas', value: 'coins', image: 'tabs/tab2.png' },
    { label: 'Gift Cards', value: 'gift', image: 'gift-box.png' },
    { label: 'Vouchers', value: 'voucher', image: 'tabs/tab4.png' },
    { label: 'Itens', value: 'items', image: 'tabs/tab5.png' },
  ];

  activeTab: string = 'topup';

  sections: any[] = [];
  allSections: any[] = [];

  ngOnInit(): void {
    this.getSections();
  }

  getSections() {
    this.sectionApi.getFrontendSections().subscribe({
      next: (res: any) => {
        console.log(res);
        const data = res.data || res;

        this.allSections = data.map((section: any) => ({
          id: this.makeSectionId(section.name),

          name: section.name,
          subtitle: section.subtitle,
          tabKeys: section.tabKeys || [],

          apiSource: section.apiSource,

          isSpecial: section.isSpecial,
          specialTitle: section.specialTitle,
          specialSubtitle: section.specialSubtitle,

          items: this.mapItems(
            section._id === 'recent-purchases'
              ? this.removeDuplicateRecentOrders(section.items || [])
              : section.items || [],
          ),
        }));

        this.sections = this.allSections;

        this.cdr.markForCheck();
      },

      error: (err) => console.error(err),
    });
  }

  removeDuplicateRecentOrders(items: any[]) {
    const uniqueMap = new Map();

    items.forEach((item: any) => {
      // keep only latest item by _id
      if (!uniqueMap.has(item._id)) {
        uniqueMap.set(item._id, item);
      } else {
        const existing = uniqueMap.get(item._id);

        const existingDate = new Date(existing.createdAt).getTime();
        const newDate = new Date(item.createdAt).getTime();

        // keep latest recent order
        if (newDate > existingDate) {
          uniqueMap.set(item._id, item);
        }
      }
    });

    return Array.from(uniqueMap.values());
  }

  onTabChange(tab: string) {
    this.activeTab = tab;

    // topup → first section
    if (tab === 'topup') {
      const firstSection = this.allSections[0];

      if (firstSection) {
        this.scrollToSection(firstSection.id);
      }

      return;
    }

    // find matching section
    const matchedSection = this.allSections.find((section) => section.tabKeys?.includes(tab));

    if (matchedSection) {
      this.scrollToSection(matchedSection.id);
    }
  }

  scrollToSection(id: string) {
    setTimeout(() => {
      const element = document.getElementById(id);

      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 100);
  }

  makeSectionId(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-');
  }

  mapItems(items: any[]) {
    return items.map((item) => ({
      title: item.name,
      image: item.image || 'cards/card-images.png',
      slug: item.slug,

      rating: item.averageRating || 0,
      totalReviews: item.totalReviews || 0,
      soldCount: item.totalSold || 0,

      sold: `${this.formatSold(item.totalSold || 0)} Vendidos`,

      raw: item,
    }));
  }

  private formatSold(count: number): string {
    if (count >= 1_000_000) {
      return (count / 1_000_000).toFixed(1).replace('.0', '') + 'M+';
    }

    if (count >= 1_000) {
      return (count / 1_000).toFixed(1).replace('.0', '') + 'K+';
    }

    return count.toString();
  }

  goToProduct(item: any) {
    this.router.navigate(['/product', item.slug]);
  }
}
