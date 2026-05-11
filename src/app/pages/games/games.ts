import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductApi } from '../../core/services/product.api';
import { CategoryApi } from '../../core/services/category.api';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './games.html',
  styleUrl: './games.css',
})
export class Games implements OnInit {
  categories: any[] = [];
  loading = false;

  constructor(
    private categoryApi: CategoryApi,
    private productApi: ProductApi,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.loading = true;

    this.categoryApi.getCategories().subscribe({
      next: (res: any) => {
        this.categories = (res.data || []).map((cat: any) => ({
          id: cat._id,
          name: cat.name,
          code: cat.code,
          slug: cat.slug,
          image: cat.image || 'assets/cards/card-images.png',
          totalProducts: cat.totalProducts || 0,
          isActive: cat.isActive,
        }));

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  openCategory(category: any) {
    this.router.navigate(['/products'], {
      queryParams: {
        category: category.id,
      },
    });
  }
}