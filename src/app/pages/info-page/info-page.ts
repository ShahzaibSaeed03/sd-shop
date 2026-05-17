import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ProductApi } from '../../core/services/product.api';

@Component({
  selector: 'app-info-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './info-page.html',
  styleUrl: './info-page.css',
})
export class InfoPage implements OnInit {

  categoryId = '';

  gameInfo: any = null;

  loading = false;
faqs: any[] = [];
  activeIndex: number | null = 0;

  constructor(
    private route: ActivatedRoute,
    private productApi: ProductApi
  ) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {

      // ✅ GET CATEGORY ID FROM URL
      this.categoryId = params['category'];

      console.log('CATEGORY ID:', this.categoryId);

      if (this.categoryId) {
        this.loadGameInformation();
      }

    });

  }
loadGameInformation() {

  this.loading = true;

  this.productApi
    .getGameInformation(this.categoryId)
    .subscribe({

      next: (res: any) => {

        this.gameInfo = res?.data;

        // ✅ IMPORTANT
        this.faqs =
          res?.data?.gameInformation || [];

        this.loading = false;

      },

      error: (err) => {

        console.log(err);

        this.loading = false;

      }

    });

}

  toggle(index: number) {

    this.activeIndex =
      this.activeIndex === index
        ? null
        : index;

  }

}