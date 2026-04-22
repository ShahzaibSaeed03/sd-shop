import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Slider } from "../../shared/components/slider/slider";
import { TabMenu } from "../../shared/components/tab-menu/tab-menu";
import { SectionBlock } from "../../shared/components/section-block/section-block";
import { CommonModule } from '@angular/common';
import { Faq } from "../../shared/components/faq/faq";
import { AdvantagSd } from "../../shared/components/advantag-sd/advantag-sd";
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
    private cdr: ChangeDetectorRef  
  ) {}

  // 🔹 ONLY TAB STATIC
  tabs = [
    { label: 'Top Up', image: 'tabs/tab1.png', value: 'topup' }
  ];

  activeTab: string = 'topup';

  // 🔥 API DATA
  sections: any[] = [];

  ngOnInit(): void {
    this.getSections();
  }

  // ✅ API CALL
  getSections() {
    this.sectionApi.getFrontendSections().subscribe({
      next: (res: any) => {

        const data = res.data || res;

        this.sections = data
          .filter((s: any) => s.isActive)
          .sort((a: any, b: any) => a.order - b.order)
          .map((section: any) => ({
            name: section.name,
            apiSource: section.apiSource,
            items: this.mapItems(section.items || [])
          }));

        this.cdr.detectChanges(); // 🔥 FIX
      },
      error: (err) => console.error(err)
    });
  }


  // ✅ MAP ITEMS
  mapItems(items: any[]) {
    return items.map(item => ({
      title: item.name,
      image: item.image || 'cards/card-images.png',
      price: item.price,
      rating: "",
      sold: '',
      raw: item
    }));
  }

goToProduct(product: any) {
  this.router.navigate(['/product-details'], {
    queryParams: { id: product.raw._id }
  });
}

  onTabChange(tab: string) {
    this.activeTab = tab;
  }
}