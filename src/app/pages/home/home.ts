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
  changeDetection: ChangeDetectionStrategy.OnPush, // ✅ ADD THIS
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
getSections() {
  this.sectionApi.getFrontendSections().subscribe({
    next: (res: any) => {
      const data = res.data || res;

      this.allSections = data.map((section: any) => ({
        name: section.name,
        mode: section.mode,
        apiSource: section.apiSource,
        items: this.mapItems(section.items || [])
      }));

      const uniqueNames = [...new Set(this.allSections.map(s => s.name))];

      this.tabs = [
        { label: 'All', value: 'all' },
        ...uniqueNames.map(name => ({
          label: name,
          value: name
        }))
      ];

      this.sections = this.allSections;

      // ✅ IMPORTANT
      this.cdr.markForCheck();
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
    this.sections = this.allSections.filter(s => s.name === tab);
  }
}

  // ==========================
  // ✅ MAP ITEMS
  // ==========================
mapItems(items: any[]) {
  return items.map(item => ({
    title: item.name,
    image: item.image || 'cards/card-images.png',
    slug: item.slug,

    raw: item
  }));
}
  // ==========================
  // ✅ NAVIGATION
  // ==========================
goToProduct(item: any) {
  this.router.navigate(['/products'], {
    queryParams: { category: item.raw._id }
  });
}
}
