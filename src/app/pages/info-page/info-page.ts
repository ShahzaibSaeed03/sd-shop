import {
  CommonModule
} from '@angular/common';

import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ChangeDetectorRef
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ProductApi } from '../../core/services/product.api';

@Component({
  selector: 'app-info-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './info-page.html',
  styleUrl: './info-page.css',
})
export class InfoPage implements OnInit, OnChanges {

  @Input() categoryId: string = '';

  gameInfo: any = null;
  loading = false;
  faqs: any[] = [];
  activeIndex: number | null = null;

  constructor(
    private productApi: ProductApi,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer  // ✅ inject karo
  ) {}

  ngOnInit(): void {
    if (this.categoryId) {
      this.loadGameInformation();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const current = changes['categoryId']?.currentValue;
    const previous = changes['categoryId']?.previousValue;
    if (current && current !== '' && current !== previous) {
      this.loadGameInformation();
    }
  }

  loadGameInformation() {
    this.loading = true;
    setTimeout(() => {
      this.productApi.getGameInformation(this.categoryId).subscribe({
        next: (res: any) => {
          this.gameInfo = res?.data;

          // ✅ har item ka content sanitize karo
          this.faqs = (res?.data?.gameInformation || []).map((item: any) => ({
            ...item,
            safeContent: this.sanitizer.bypassSecurityTrustHtml(item.content || '')
          }));

          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.log(err);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }, 0);
  }

  toggle(index: number) {
    this.activeIndex = this.activeIndex === index ? null : index;
  }
}