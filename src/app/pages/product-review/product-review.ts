import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SectionBlock } from '../../shared/components/section-block/section-block';
import { TabMenu } from '../../shared/components/tab-menu/tab-menu';
import { Router, RouterLink } from "@angular/router";
import { Review } from "../review/review";
import { InfoPage } from "../info-page/info-page";

interface Product {
  id: number;
  title: string;
  subtitle?: string;
  price: number;
  oldPrice: number;
  discount: number;
  img: string;
}

@Component({
  selector: 'app-product-review',
  standalone: true,
  imports: [CommonModule, Review, InfoPage],
  templateUrl: './product-review.html',
})
export class ProductReview {
  constructor(private router: Router) {}


  activeTab = 'crystals';

  tabs = [
    { key: 'crystals', label: 'Crystals top-up' },
    { key: 'packages', label: 'Packages & Bundles' },
    { key: 'subscription', label: 'Subscription' },
    { key: 'topup', label: 'Top-up Bonuses' }
  ];

products = [
  {
    id: 1,
    title: 'Passe de Suprimentos',
    subtitle: 'Passe de Suprimentos',
    price: 19.23,
    oldPrice: 24.95,
    discount: 5.72,
    img: 'cards/card-images.png'
  },
  {
    id: 2,
    title: 'Sparxie Garantida',
    price: 1311,
    oldPrice: 1735,
    discount: 424,
    img: 'cards/card-images.png'
  },
  {
    id: 3,
    title: 'Yao Guang Garantida',
    price: 1311,
    oldPrice: 1735,
    discount: 424,
    img: 'cards/card-images.png'
  },
  {
    id: 4,
    title: 'Cerydra Garantida',
    price: 1311,
    oldPrice: 1735,
    discount: 424,
    img: 'cards/card-images.png'
  },
  {
    id: 5,
    title: '60 Crystals',
    price: 4.99,
    oldPrice: 6.99,
    discount: 2,
    img: 'cards/card-images.png'
  },
  {
    id: 6,
    title: '300 Crystals',
    price: 14.99,
    oldPrice: 19.99,
    discount: 5,
    img: 'cards/card-images.png'
  },
  {
    id: 7,
    title: '980 Crystals',
    price: 49.99,
    oldPrice: 59.99,
    discount: 10,
    img: 'cards/card-images.png'
  },
  {
    id: 8,
    title: '1980 Crystals',
    price: 99.99,
    oldPrice: 119.99,
    discount: 20,
    img: 'cards/card-images.png'
  },
  {
    id: 9,
    title: '3280 Crystals',
    price: 149.99,
    oldPrice: 179.99,
    discount: 30,
    img: 'cards/card-images.png'
  },
  {
    id: 10,
    title: '6480 Crystals',
    price: 299.99,
    oldPrice: 349.99,
    discount: 50,
    img: 'cards/card-images.png'
  },
  {
    id: 11,
    title: 'Monthly Pass',
    price: 9.99,
    oldPrice: 12.99,
    discount: 3,
    img: 'cards/card-images.png'
  },
  {
    id: 12,
    title: 'Premium Bundle',
    price: 199.99,
    oldPrice: 249.99,
    discount: 50,
    img: 'cards/card-images.png'
  }
];

  selectedProduct: Product | null = null;
  quantity = 1;

  selectProduct(p: Product) {
    this.selectedProduct = p;
    this.quantity = 1;
  }

  increase() {
    this.quantity++;
  }

  decrease() {
    if (this.quantity > 1) this.quantity--;
  }

  get total() {
    return this.selectedProduct
      ? (this.selectedProduct.price * this.quantity).toFixed(2)
      : '0.00';
  }
   checkout() {
  // if (!this.selectedProduct) return;

  this.router.navigate(['/checkout'], {
    queryParams: {
      name: this.selectedProduct?.title,
      price: this.selectedProduct?.price,
      qty: this.quantity,
      // total: this.totalPrice
    }
  });
}
}