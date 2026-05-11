import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
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
  imports: [CommonModule, Review, InfoPage, FormsModule, RouterLink],
  templateUrl: './product-review.html',
})
export class ProductReview implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productApi: ProductApi,
    private couponApi: CouponApi,
    private authService: AuthService,
    private orderApi: OrderApi,
    private cdr: ChangeDetectorRef,
  ) {}

  // ================= DATA =================
  product: any = null;
  products: any[] = [];
  selectedProduct: any = null;
  isLoggedIn = false;

  // ✅ Affiliate data (backend se aaye toh load karo, filhal hardcoded)
  affiliate: any = {
    handle: 'MegaHSR',
    code: 'MEGA',
    avatar: 'assets/affiliate-avatar.png',
  };

  // ✅ SD Coins (logged-in user ke cashback points)
  userCoins: number = 0;
  useCoins: boolean = false;

  // ================= COUPON =================
  couponResult: any = null;
  couponError: string = '';
  coupon = '';
  discount = 0;
  finalAmount = 0;
  couponApplied = false;

  // ================= FORMS =================
  forms: any[] = [];

  // ================= UI STATE =================
  quantity = 1;
  username: string = '';
  checkingUser = false;
  userError = '';
  loading = false;

  // ================= FORM =================
  form = {
    email: '',
    userId: '',
    server: '',
    nickname: '',
    zone: '',
  };

  errors: any = {};

  // ================= TABS (Portuguese) =================
  activeTab = 'crystals';
  tabs = [
    { key: 'crystals', label: 'Event Bundles' },
    { key: 'packages', label: 'Produtos Recentes' },
    { key: 'subscription', label: 'Passe de Suprimentos' },
    { key: 'topup', label: 'Fragmentos' },
  ];

  // ================= INIT =================
  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.loadUserCoins();

    // ✅ Logged in user ka email auto-fill karo
    if (this.isLoggedIn) {
      this.loadUserEmail();
    }

    this.route.queryParamMap.subscribe((params) => {
      const productId = params.get('id');
      const categoryId = params.get('category');

      if (categoryId) {
        this.loadByCategory(categoryId);
      } else if (productId) {
        this.getProduct(productId);
      }
    });
  }

  // ✅ User ka email localStorage se load karo
  loadUserEmail(): void {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const user = JSON.parse(stored);
        this.form.email = user.email || '';
      }
    } catch (e) {
      console.error('Failed to load user email', e);
    }
  }
  // ✅ Load coins from localStorage user object
  loadUserCoins(): void {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const user = JSON.parse(stored);
        this.userCoins = user.cashbackPoints || 0;
      }
    } catch (e) {
      console.error('Failed to load user coins', e);
      this.userCoins = 0;
    }
  }

  // ✅ Toggle SD coins usage
  toggleUseCoins(): void {
    this.useCoins = !this.useCoins;
    // Optional: yahan price recalculate kar sakte ho coins discount ke saath
  }

  // ================= LOAD BY CATEGORY =================
  loadByCategory(categoryId: string) {
    this.productApi.getByCategory(categoryId).subscribe({
      next: (res: any) => {
        const list = res.data || [];
        if (!list.length) return;

        // ✅ map products for the grid
        this.products = list.map((p: any) => ({
          id: p._id,
          title: p.displayName || p.name || 'No Name',
          subtitle: p.categoryName || p.category?.name || 'Game Top Up',
          price: Number(p.finalPrice || p.price || 0),
          img: p.image || p.category?.image || 'assets/cards/card-images.png',
          sold: p.sold || 0,
          rating: p.rating || 5,
          reviews: p.reviews || 0,
          tag: p.tag || 'Popular',
          raw: p,
        }));

        // 🔥 auto-pick first product
        this.selectedProduct = this.products[0];
        this.setMainProduct(this.selectedProduct.raw);

        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  // ================= SET MAIN PRODUCT =================
  setMainProduct(data: any) {
    this.product = {
      id: data._id,
      name: data.displayName || data.name,
      image: data.image || data.category?.image || 'assets/cards/card-images.png',
      categoryName: data.categoryName || data.category?.name || 'Game Top Up',
      price: data.finalPrice ?? data.price,
      originalPrice: data.price,
      requiresUserId: data.requiresUserId,
      requiresServer: data.requiresServer,
      requiresNickname: data.requiresNickname,
      requiresZone: data.requiresZone,
      sold: data.sold || 0,
      rating: data.rating || 5,
      reviews: data.reviews || 0,
      tag: data.tag || 'Popular',
    };

    // ✅ forms depend on selected product
    this.forms = [{ name: 'email', type: 'text' }, ...(data.category?.forms || [])];

    console.log('FORMS =>', this.forms);

    // ✅ reset coupon, qty when product changes
    this.quantity = 1;
    this.coupon = '';
    this.discount = 0;
    this.couponApplied = false;
    this.finalAmount = 0;
    this.useCoins = false;
  }

  // ✅ Sold count formatter (Brazilian style — 1500000 → "1.5Mil+")
  formatSold(count: number): string {
    if (!count) return '0';
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1).replace('.0', '') + 'Mil+';
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(0) + 'Mil+';
    }
    return count.toString();
  }

  // ================= CHECK USER ID =================
  // ================= USER VALIDATION =================

  checkUserId() {
    this.userError = '';
    this.username = '';

    // ✅ empty validation
    if (!this.form.userId?.trim()) {
      return;
    }

    // ✅ UID format validation
    const cleanUid = this.form.userId.trim();

    // only numbers allowed
    if (!/^\d+$/.test(cleanUid)) {
      this.userError = 'UID inválido. Apenas números são permitidos.';
      return;
    }

    // length validation
    if (cleanUid.length < 6 || cleanUid.length > 20) {
      this.userError = 'UID inválido.';
      return;
    }

    // ✅ server required only if options exist
    const hasServers = this.getServerOptions().length > 0;

    if (hasServers && !this.form.server) {
      this.userError = 'Selecione o servidor.';
      return;
    }

    this.checkingUser = true;

    this.orderApi
      .checkUser({
        categoryCode: this.selectedProduct?.raw?.supplierCategory,
        userId: cleanUid,
        serverId: this.form.server || '',
        nickname: this.form.nickname,
      })
      .subscribe({
        next: (res: any) => {
          this.checkingUser = false;

          console.log('CHECK USER RESPONSE =>', res);

          // ❌ invalid user
          if (!res || res.success === false) {
            this.username = '';
            this.form.nickname = '';

            this.userError = res?.message || res?.error || 'UID inválido. Conta não encontrada.';

            this.cdr.detectChanges();
            return;
          }

          // ✅ valid user
          this.username = res.username || '';
          this.form.nickname = res.username || '';
          this.userError = '';

          this.cdr.detectChanges();
        },

        error: (err) => {
          console.log('CHECK USER ERROR =>', err);

          this.checkingUser = false;
          this.username = '';

          this.userError = err?.error?.message || 'Não foi possível validar o UID.';

          this.cdr.detectChanges();
        },
      });
  }
  requireLogin(): boolean {
    return true;
  }
  get isUserValid(): boolean {
    return !!this.username && !this.userError;
  }
  // ================= COUPON =================
  applyCoupon() {
    if (!this.requireLogin()) return;
    if (!this.coupon) return;

    const payload = {
      code: this.coupon,
      totalAmount: this.totalPrice,
      cartProducts: [{ _id: this.selectedProduct?.raw?._id }],
    };

    this.couponApi.applyCoupon(payload).subscribe({
      next: (res: any) => {
        console.log('COUPON RESPONSE:', res);

        this.discount = res.discount;
        this.finalAmount = res.finalAmount;
        this.couponApplied = true;
      },
      error: (err) => {
        alert(err.error?.message || 'Cupom inválido');

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
    this.couponApplied = false;
    this.discount = 0;
  }

  // ================= API (DIRECT PRODUCT LINK) =================
  getProduct(id: string) {
    this.productApi.getProductById(id).subscribe({
      next: (res: any) => {
        const data = res.data || res;

        // ✅ set main product (header + form + checkout)
        this.setMainProduct(data);

        // ✅ start grid with this product
        this.products = [
          {
            id: data._id,
            title: data.displayName || data.name,
            subtitle: data.categoryName || data.category?.name || 'Game Top Up',
            price: Number(data.finalPrice || data.price || 0),
            img: data.image || 'assets/cards/card-images.png',
            sold: data.sold || 0,
            rating: data.rating || 5,
            reviews: data.reviews || 0,
            tag: data.tag || 'Popular',
            raw: data,
          },
        ];

        this.selectedProduct = this.products[0];

        // 🔥 also load siblings from same category
        if (data.category?._id) {
          this.getCategoryProducts(data.category._id, data._id);
        }

        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  // ================= GET CATEGORY PRODUCTS =================
  getCategoryProducts(categoryId: string, currentProductId: string) {
    this.productApi.getByCategory(categoryId).subscribe({
      next: (res: any) => {
        const list = res.data || [];

        this.products = list.map((p: any) => ({
          id: p._id,
          title: p.displayName || p.name || 'No Name',
          subtitle:
            p.categoryName || p.category?.name || this.product?.categoryName || 'Game Top Up',
          price: Number(p.finalPrice || p.price || 0),
          img:
            p.image || p.category?.image || this.product?.image || 'assets/cards/card-images.png',
          sold: p.sold || 0,
          rating: p.rating || 5,
          reviews: p.reviews || 0,
          tag: p.tag || 'Popular',
          raw: p,
        }));

        const current = this.products.find((x) => x.id === currentProductId);
        if (current) {
          this.selectedProduct = current;
        }

        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  // ================= SELECT (CLICK ON CARD) =================
  selectProduct(p: any) {
    this.selectedProduct = p;
    // 🔥 update header + form + checkout
    this.setMainProduct(p.raw);
    this.cdr.detectChanges();
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
    return this.selectedProduct ? this.selectedProduct.price * this.quantity : 0;
  }

  // ✅ SERVER OPTIONS
  getServerOptions(): any[] {
    const serverField = this.forms.find((f: any) => f.name === 'additional_id');

    return serverField?.options || [];
  }
  get payableAmount(): number {
    let amount = this.couponApplied ? this.finalAmount : this.totalPrice;

    // ✅ Agar user SD coins use kar raha hai, discount lagao
    // (100 pontos = R$1,00 ke ratio se)
    if (this.useCoins && this.userCoins > 0) {
      const coinsDiscount = this.userCoins / 100;
      amount = Math.max(0, amount - coinsDiscount);
    }

    return amount;
  }

  // ================= VALIDATION (Portuguese errors) =================
  validate(): boolean {
    this.errors = {};

    if (!this.isLoggedIn && !this.form.email) {
      this.errors.email = 'E-mail obrigatório';
    }

    if (this.product?.requiresUserId && !this.form.userId) {
      this.errors.userId = 'UID obrigatório';
    }

    if (this.product?.requiresServer && !this.form.server) {
      this.errors.server = 'Servidor obrigatório';
    }

    if (this.product?.requiresNickname && !this.form.nickname) {
      this.errors.nickname = 'Apelido obrigatório';
    }

    if (this.product?.requiresZone && !this.form.zone) {
      this.errors.zone = 'Zona obrigatória';
    }

    return Object.keys(this.errors).length === 0;
  }

  // ================= CHECKOUT =================
  checkout() {

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

        // ✅ Pass coins usage to checkout page
        useCoins: this.useCoins,
        coinsUsed: this.useCoins ? this.userCoins : 0,
      },
    });
  }
}
