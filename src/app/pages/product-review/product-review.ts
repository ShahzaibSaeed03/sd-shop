import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Review } from "../review/review";
import { InfoPage } from "../info-page/info-page";
import { ProductApi } from '../../core/services/product.api';
import { FormsModule } from '@angular/forms';
import { CouponApi } from '../../core/services/coupon.api';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-product-review',
  standalone: true,
  imports: [CommonModule, Review, InfoPage, FormsModule],
  templateUrl: './product-review.html',
})
export class ProductReview implements OnInit {
  couponResult: any = null;
  couponError: string = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productApi: ProductApi,
    private couponApi: CouponApi,
    private authService: AuthService,
    private cdr: ChangeDetectorRef // ✅ FIX
  ) { }

  // ================= DATA =================
  product: any = null;
  products: any[] = [];
  selectedProduct: any = null;

  // ================= UI =================
  quantity = 1;
  coupon = '';
  discount = 0;
  finalAmount = 0;
  couponApplied = false;
  // ================= FORM =================
  form = {
    userId: '',
    server: '',
    nickname: '',
    zone: ''
  };

  errors: any = {};

  // ================= TABS =================
  activeTab = 'crystals';
  tabs = [
    { key: 'crystals', label: 'Crystals top-up' },
    { key: 'packages', label: 'Packages & Bundles' },
    { key: 'subscription', label: 'Subscription' },
    { key: 'topup', label: 'Top-up Bonuses' }
  ];

  // ================= INIT =================
  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.getProduct(id);
      }
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
      totalAmount: this.totalPrice,
      cartProducts: [
        { _id: this.selectedProduct?.raw?._id }
      ]
    };

    this.couponApi.applyCoupon(payload).subscribe({
      next: (res: any) => {

        this.discount = res.discount;
        this.finalAmount = res.finalAmount;
        this.couponApplied = true;

      },
      error: (err) => {
        alert(err.error?.message || 'Invalid coupon');
        this.discount = 0;
        this.finalAmount = this.totalPrice;
        this.couponApplied = false;
      }
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
          price: data.finalPrice || data.price,
          requiresUserId: data.requiresUserId,
          requiresServer: data.requiresServer,
          requiresNickname: data.requiresNickname,
          requiresZone: data.requiresZone
        };

        // ✅ PRODUCT LIST
        this.products = [{
          id: data._id,
          title: data.name,
          subtitle: data.categoryName,
          price: data.finalPrice || data.price,
          oldPrice: (data.finalPrice || data.price) + 100,
          discount: 100,
          img: data.image || 'assets/cards/card-images.png',
          raw: data
        }];

        this.selectedProduct = this.products[0];

        this.cdr.detectChanges(); // 🔥 IMPORTANT FIX
      },
      error: (err) => console.error(err)
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
    return this.selectedProduct
      ? this.selectedProduct.price * this.quantity
      : 0;
  }
  get payableAmount(): number {
    return this.couponApplied
      ? this.finalAmount
      : this.totalPrice;
  }
  // ================= VALIDATION =================
  validate(): boolean {
    this.errors = {};

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

        // 🔥 IMPORTANT FIX
        price: this.selectedProduct?.price,        // original
        finalPrice: this.payableAmount,            // ✅ after coupon
        discount: this.discount,                  // ✅ discount value

        qty: this.quantity,

        userId: this.form.userId,
        server: this.form.server,
        nickname: this.form.nickname,
        zone: this.form.zone,

        coupon: this.coupon
      }
    });
  }
}