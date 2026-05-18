import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductApi } from '../../core/services/product.api';

@Component({
  selector: 'app-info-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './info-page.html',
  styleUrl: './info-page.css',
})
export class InfoPage implements OnChanges {

  // ✅ Parent se categoryId receive karo
  @Input() categoryId: string = '';

  gameInfo: any = null;
  loading = false;
  faqs: any[] = [];
  activeIndex: number | null = 0;

  constructor(private productApi: ProductApi) {}

  // ✅ Input change hone par API call karo
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categoryId']?.currentValue) {
      this.loadGameInformation();
    }
  }

  loadGameInformation() {
    this.loading = true;
    this.productApi.getGameInformation(this.categoryId).subscribe({
      next: (res: any) => {
        this.gameInfo = res?.data;
        this.faqs = res?.data?.gameInformation || [];
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      }
    });
  }

  toggle(index: number) {
    this.activeIndex = this.activeIndex === index ? null : index;
  }
}