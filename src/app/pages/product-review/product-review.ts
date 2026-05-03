import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Review } from '../review/review';
import { InfoPage } from '../info-page/info-page';
import { ProductApi } from '../../core/services/product.api';
import { FormsModule } from '@angular/forms';
import { CouponApi } from '../../core/services/coupon.api';
import { AuthService } from '../../core/services/auth.service';
import { OrderApi } from '../../core/services/order.api';

interface Product {
  _id: string;
  name: string;
  displayName: string;
  price: number;
  finalPrice: number;
  categoryName: string;
  image?: string;
  category?: {
    image?: string;
  };
}
@Component({
  selector: 'app-product-review',
  standalone: true,
  imports: [CommonModule, Review, InfoPage, FormsModule],
  templateUrl: './product-review.html',
})
export class ProductReview implements OnInit {
  couponResult: any = null;
  couponError: string = '';
  forms: any[] = [];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productApi: ProductApi,
    private couponApi: CouponApi,
    private authService: AuthService,
    private orderApi: OrderApi,
    private cdr: ChangeDetectorRef, // ✅ FIX
  ) {}

  // ================= DATA =================
  product: any = null;
  products: any[] = [];
  selectedProduct: any = null;
  isLoggedIn = false;
  // ================= UI =================
  quantity = 1;
  coupon = '';
  discount = 0;
  finalAmount = 0;
  couponApplied = false;
  username: string = '';
  checkingUser = false;
  userError = '';
  // ================= FORM =================
  form = {
    email: '', // ✅ ADD THIS
    userId: '',
    server: '',
    nickname: '',
    zone: '',
  };

  errors: any = {};

  // ================= TABS =================
  activeTab = 'crystals';
  tabs = [
    { key: 'crystals', label: 'Crystals top-up' },
    { key: 'packages', label: 'Packages & Bundles' },
    { key: 'subscription', label: 'Subscription' },
    { key: 'topup', label: 'Top-up Bonuses' },
  ];

  // ================= INIT =================
  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();

    this.route.queryParamMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.getProduct(id);
      }
    });
  }
  checkUserId() {
    console.log('🔥 checkUserId called');
    console.log('FORM DATA:', this.form);

    if (!this.form.userId) return;

    if (!this.form.server) {
      this.userError = 'Please select server first';
      return;
    }

    this.checkingUser = true;
    this.userError = '';
    this.username = '';

    this.orderApi
      .checkUser({
        categoryCode: this.selectedProduct?.raw?.supplierCategory,
        userId: this.form.userId,
        serverId: this.form.server,
        nickname: this.form.nickname,
      })
      .subscribe({
        next: (res) => {
          console.log('✅ API RESPONSE:', res);

          this.checkingUser = false;

          if (res.success) {
            this.username = res.username;

            // 🔥 MAIN FIX: AUTO SET NICKNAME
            this.form.nickname = res.username;
          } else {
            this.userError = 'Invalid ID';
          }
        },
        error: (err) => {
          console.log('❌ API ERROR:', err);

          this.checkingUser = false;
          this.userError = 'Invalid ID';
        },
      });
  }
  loading = false;
  requireLogin(): boolean {
    if (!this.authService.isLoggedIn()) {
      // 🔥 OPTION 1: trigger modal (recommended)
      window.dispatchEvent(new CustomEvent('openLoginModal'));

      // 🔥 OPTION 2 (fallback): redirect
      // this.router.navigate(['/login']);

      return false;
    }

    return true;
  }
applyCoupon() {
  if (!this.requireLogin()) return;
  if (!this.coupon) return;

  const payload = {
    code: this.coupon,
    totalAmount: this.totalPrice, // ✅ original total
    cartProducts: [{ _id: this.selectedProduct?.raw?._id }],
  };

  this.couponApi.applyCoupon(payload).subscribe({
    next: (res: any) => {

      console.log('COUPON RESPONSE:', res);

      this.discount = res.discount;

      // ✅ ONLY STORE HERE
      this.finalAmount = res.finalAmount;

      this.couponApplied = true;

      // ❌ NEVER TOUCH selectedProduct.price
    },
    error: (err) => {
      alert(err.error?.message || 'Invalid coupon');

      this.discount = 0;
      this.finalAmount = this.totalPrice;
      this.couponApplied = false;
    },
  });
}

  removeCoupon() {
    this.coupon = '';
    this.couponResult = null;
    this.couponError = '';
  }
  // ================= API =================
  getProduct(id: string) {
    this.productApi.getProductById(id).subscribe({
      next: (res: any) => {
        const data = res.data || res;

        // ✅ MAIN PRODUCT
        this.product = {
          id: data._id,
          name: data.name,
          image: data.image,
          categoryName: data.categoryName,
          price: data.finalPrice, // ✅ ALWAYS FINAL PRICE
          originalPrice: data.price, // optional
          requiresUserId: data.requiresUserId,
          requiresServer: data.requiresServer,
          requiresNickname: data.requiresNickname,
          requiresZone: data.requiresZone,
        };

        // ✅ FORMS
        this.forms = [
          { name: 'email', type: 'text' }, // 🔥 ADD EMAIL FIELD
          ...(data.forms || []),
        ];
        // ✅ MAIN PRODUCT CARD
        this.products = [
          {
            id: data._id,
            title: data.name,
            subtitle: data.categoryName,
            price: data.finalPrice,
            img: data.image || 'cards/card-images.png',
            raw: data,
          },
        ];
     console.log(this.product)
        this.selectedProduct = this.products[0];

        // 🔥🔥🔥 NEW: CALL CATEGORY PRODUCTS
        if (data.category?._id) {
          this.getCategoryProducts(data.category._id, data._id);
        }

        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

 getCategoryProducts(categoryId: string, currentProductId: string) {
  this.productApi.getByCategory(categoryId).subscribe({
    next: (res: any) => {

      const list = res.data || [];

      this.products = list
        .filter((p: any) => p._id !== currentProductId)
        .map((p: any) => ({
          id: p._id,
          title: p.displayName || p.name,
          subtitle: p.categoryName,
          price: p.finalPrice, // ✅ always finalPrice
          img: p.image || p.category?.image || 'assets/cards/card-images.png',
          raw: p,
        }));

      // ❌ DO NOT TOUCH selectedProduct HERE

      this.cdr.detectChanges();
    },
    error: (err) => console.error(err),
  });
}
  // ================= SELECT =================
  selectProduct(p: any) {
    this.selectedProduct = p;
    this.quantity = 1;
  }

  // ================= QUANTITY =================
  increase() {
    if (this.quantity < 10) this.quantity++;
  }

  decrease() {
    if (this.quantity > 1) this.quantity--;
  }

  // ================= PRICE =================
get totalPrice(): number {
  const total = this.selectedProduct
    ? this.selectedProduct.price * this.quantity
    : 0;

  console.log('PRICE DEBUG:', {
    price: this.selectedProduct?.price,
    qty: this.quantity,
    total: total
  });

  return total;
}
  get payableAmount(): number {
    return this.couponApplied ? this.finalAmount : this.totalPrice;
  }
  // ================= VALIDATION =================
  validate(): boolean {
    this.errors = {};
    if (!this.isLoggedIn && !this.form.email) {
      this.errors.email = 'Email required';
    }
    if (this.product?.requiresUserId && !this.form.userId) {
      this.errors.userId = 'User ID required';
    }

    if (this.product?.requiresServer && !this.form.server) {
      this.errors.server = 'Server required';
    }

    if (this.product?.requiresNickname && !this.form.nickname) {
      this.errors.nickname = 'Nickname required';
    }

    if (this.product?.requiresZone && !this.form.zone) {
      this.errors.zone = 'Zone required';
    }

    return Object.keys(this.errors).length === 0;
  }

  // ================= CHECKOUT =================
  checkout() {
    if (!this.requireLogin()) return;

    if (!this.validate()) return;

    this.router.navigate(['/checkout'], {
      queryParams: {
        id: this.selectedProduct?.raw?._id,
        title: this.selectedProduct?.title,
        subtitle: this.selectedProduct?.subtitle,
        image: this.selectedProduct?.img,

        price: this.selectedProduct?.price,
        finalPrice: this.payableAmount,
        discount: this.discount,

        qty: this.quantity,

        ...(this.isLoggedIn ? {} : { email: this.form.email }),

        userId: this.form.userId,
        server: this.form.server,
        nickname: this.form.nickname,
        zone: this.form.zone,

        coupon: this.coupon,
      },
    });
  }
}
