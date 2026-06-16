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
  bundles: any[] = [];
  serverOptions: any[] = [];
  selectedBundle: any = null;

  bundlePopup = false;
  affiliate: any = null;
  // ✅ SD Coins
  userCoins: number = 0;
  useCoins: boolean = false;
  slug: string = '';

  // ================= COUPON =================
  couponResult: any = null;
  couponError: string = '';
  coupon = '';
  discount = 0;
  finalAmount = 0;
  couponApplied = false;
  cameViaAffiliateLink = false;

  // ================= FORMS =================
  forms: any[] = [];

  quantity = 1;
  username: string = '';
  checkingUser = false;
  userError = '';
  loading = false;

  form = {
    email: '',
    userId: '',
    server: '',
    nickname: '',
    zone: '',
  };

  errors: any = {};

  // ================= INIT =================
  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();

    // ✅ Pehle localStorage se quick load (UI flicker se bachne ke liye)
    this.loadUserCoins();

    // ✅ Phir backend se realtime coins fetch karo (header ki tarah)
    if (this.isLoggedIn) {
      this.loadRealtimeCoins();
      this.loadUserEmail();
    }

    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      const couponCode = params.get('couponCode'); // ✅ ADD

      if (!slug) return;

      this.slug = slug;

      if (couponCode) {
        this.coupon = couponCode.toUpperCase(); // ✅ ADD
        this.cameViaAffiliateLink = true; // ✅ ADD
      }

      this.loadByCategorySlug(slug);
    });
  }

  // ✅ Logged in user ka email auto-fill karo
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

  // ✅ localStorage se quick coins load (initial UI)
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

  // ✅ NEW: Backend se realtime coins fetch karo
  loadRealtimeCoins(): void {
    this.authService.getCashback().subscribe({
      next: (res: any) => {
        const realtimePoints = res.points || res.cashbackPoints || 0;
        this.userCoins = realtimePoints;

        // ✅ localStorage bhi sync karo (next page pe stale na ho)
        this.syncLocalStorageCoins(realtimePoints);

        console.log('💰 Realtime coins loaded:', realtimePoints);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to fetch realtime coins', err);
        // Error pe fallback localStorage value pe — already loaded
      },
    });
  }

  // ✅ Helper: localStorage me coins sync karo
  syncLocalStorageCoins(newCoins: number): void {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const user = JSON.parse(stored);
        user.cashbackPoints = newCoins;
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (e) {
      console.error('Failed to sync coins to localStorage', e);
    }
  }

  toggleUseCoins(): void {
    this.useCoins = !this.useCoins;

    if (this.useCoins && this.isLoggedIn) {
      this.loadRealtimeCoins();
    }
  }

  // ================= LOAD BY CATEGORY =================
  loadByCategorySlug(slug: string) {
    this.productApi.getProductsByCategorySlug(slug).subscribe({
      next: (res: any) => {
        const list = res.data || [];
        if (!list.length) return;

        const category = res.category; // ✅ category pehle nikalo

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
          raw: {
            ...p,
            category: category, // ✅ har product ke raw mein full category inject karo
          },
        }));

        this.selectedProduct = this.products[0];
        this.selectedProductId = this.products[0]?.id;
        this.setMainProduct(this.selectedProduct.raw);

        // ✅ setMainProduct ke baad stats aur category DONO set karo
        this.product.sold = category.sold || 0;
        this.product.rating = category.rating || 0;
        this.product.totalReviews = category.totalReviews || 0;
        this.product.category = category; // ✅ yahi fix hai

        this.loadBundles(category._id);

        if (this.coupon) {
          setTimeout(() => this.applyCoupon(), 300);
        }

        console.log('✅ category._id =', this.product?.category?._id); // confirm karo

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  setMainProduct(data: any) {
    this.product = {
      id: data._id,
      category: data.category,
      name: data.displayName || data.name,
      image: data.image || data.category?.image || 'cards/card-images.png',
      categoryName: data.categoryName || data.category?.name || 'Game Top Up',
      price: data.customPrice ?? data.finalPrice ?? data.price ?? 0,
      originalPrice: data.price,
      requiresUserId: data.requiresUserId,
      requiresServer: data.requiresServer,
      requiresNickname: data.requiresNickname,
      requiresZone: data.requiresZone,
      // ✅ CATEGORY STATS
      sold: this.product?.sold || 0,

      rating: this.product?.rating || 0,

      totalReviews: this.product?.totalReviews || 0,
      tag: data.tag || 'Popular',
    };
    this.affiliate = data.affiliate || null;
    this.forms = [{ name: 'email', type: 'text' }, ...(data.category?.forms || [])];

    const serverField = this.forms.find((f: any) => f.name === 'server_id' || f.name === 'server');

    this.serverOptions = (serverField?.options || []).map((x: any) =>
      typeof x === 'string' ? { value: x, name: x } : x,
    );

    this.quantity = 1;
    this.discount = 0;
    this.couponApplied = false;
    this.finalAmount = 0;
    this.useCoins = false;
  }

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

  checkUserId() {
    this.userError = '';
    this.username = '';

    if (!this.form.userId?.trim()) return;

    const cleanUid = this.form.userId.trim();

    if (!/^\d+$/.test(cleanUid)) {
      this.userError = 'UID inválido. Apenas números são permitidos.';
      return;
    }

    if (cleanUid.length < 6 || cleanUid.length > 20) {
      this.userError = 'UID inválido.';
      return;
    }

    const hasServers = this.serverOptions.length > 0;

    if (hasServers && !this.form.server) {
      this.userError = 'Selecione o servidor.';
      return;
    }

    this.checkingUser = true;

    this.orderApi
      .checkUser({
        categoryCode: this.selectedProduct?.raw?.category?.code || this.product?.category?.code,
        userId: cleanUid,
        serverId: this.form.server || '',
        nickname: this.form.nickname,
      })
      .subscribe({
        next: (res: any) => {
          this.checkingUser = false;

          if (!res || res.success === false) {
            this.username = '';
            this.form.nickname = '';
            this.userError = res?.message || res?.error || 'UID inválido. Conta não encontrada.';
            this.cdr.detectChanges();
            return;
          }

          this.username = res.username || '';
          this.form.nickname = res.username || '';
          this.userError = '';
          this.cdr.detectChanges();
        },
        error: (err) => {
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
        // ✅ PREVIEW ONLY — backend will re-apply at order time
        this.discount = res.discount;
        this.finalAmount = res.finalAmount;
        this.couponApplied = true;

        console.log('🎟️ Coupon preview:', {
          code: this.coupon,
          discount: this.discount,
          afterCoupon: this.finalAmount,
        });
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
    this.couponResult = null;
    this.couponError = '';
    this.couponApplied = false;
    this.discount = 0;
  }

  getProduct(id: string) {
    this.productApi.getProductById(id).subscribe({
      next: (res: any) => {
        const data = res.data || res;
        this.setMainProduct(data);

        this.products = [
          {
            id: data._id,
            title: data.displayName || data.name,
            subtitle: data.categoryName || data.category?.name || 'Game Top Up',
            price: Number(data.finalPrice || data.price || 0),
            img: data.image || 'assets/cards/card-images.png',
            sold: data.sold || 0,
            tag: data.tag || 'Popular',
            raw: data,
          },
        ];

        this.selectedProduct = this.products[0];

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

        this.products = list.map((p: any) => ({
          id: p._id,
          title: p.displayName || p.name || 'No Name',
          subtitle:
            p.categoryName || p.category?.name || this.product?.categoryName || 'Game Top Up',
          price: Number(p.finalPrice || p.price || 0),
          img:
            p.image || p.category?.image || this.product?.image || 'assets/cards/card-images.png',
          sold: p.sold || 0,
          rating: p.rating,
          reviews: p.reviews,
          tag: p.tag || 'Popular',
          raw: p,
        }));
        this.loadBundles(categoryId);
        const current = this.products.find((x) => x.id === currentProductId);
        if (current) this.selectedProduct = current;

        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }
  loadBundles(categoryId: string) {
    // ✅ agar bundles pehle se loaded hain same category ke liye to skip karo
    if (this.bundles.length > 0 && this.bundles[0]?.category?._id === categoryId) {
      return;
    }

    this.productApi.getBundlesByCategory(categoryId).subscribe({
      next: (res: any) => {
        this.bundles = res.data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  getBundleBadges(): string[] {
    const badges = this.bundles.map((x: any) => x.badge).filter((x: string) => !!x);
    return ['Produtos', ...new Set(badges)];
  }
  // ✅ TABS
  tabs = [
    {
      key: 'ALL',
      label: 'Todos',
    },

    ...this.getBundleBadges().map((badge: string) => ({
      key: badge,
      label: badge,
    })),
  ];

  activeTab = 'Produtos';

  getBundleCount(badge: string): number {
    if (badge === 'Produtos') {
      return this.bundles.length;
    }

    return this.bundles.filter((x: any) => x.badge === badge).length;
  }
  activeBundleBadge = 'Produtos';

  get filteredBundles() {
    if (this.activeBundleBadge === 'Produtos') {
      return this.products;
    }
    return this.bundles.filter((x: any) => x.badge === this.activeBundleBadge);
  }
  selectedProductId: string | null = null;

  selectBundle(bundle: any) {
    this.selectedProductId = bundle._id;

    this.selectedBundle = bundle;

    // ✅ full product structure maintain
    const mappedBundleProduct = {
      _id: bundle._id,

      displayName: bundle.name,
      name: bundle.name,

      image: bundle.image || bundle.baseProduct?.image,

      categoryName: bundle.category?.name || this.product?.categoryName,

      finalPrice: bundle.customPrice || bundle.finalPrice || 0,

      price: bundle.customPrice || bundle.finalPrice || 0,

      sold: bundle.sold || 0,
      rating: bundle.rating || 5,
      reviews: bundle.reviews || 0,
      tag: bundle.badge || 'Bundle',

      affiliate: this.affiliate,

      // ✅ IMPORTANT
      category: {
        ...(this.selectedProduct?.raw?.category || {}),
        ...(bundle.category || {}),
      },

      requiresUserId: this.selectedProduct?.raw?.requiresUserId ?? true,

      requiresServer: this.selectedProduct?.raw?.requiresServer ?? false,

      requiresNickname: this.selectedProduct?.raw?.requiresNickname ?? false,

      requiresZone: this.selectedProduct?.raw?.requiresZone ?? false,

      // ✅ bundle info
      isBundle: true,
      bundleId: bundle._id,
      baseProductId: bundle.baseProduct?._id,
      bundleQuantity: bundle.quantity,
    };

    // ✅ SAME STRUCTURE AS PRODUCTS
    const bundlePrice = Number(
      bundle.customPrice ?? bundle.finalPrice ?? bundle.baseProduct?.price ?? 0,
    );

    this.selectedProduct = {
      id: bundle._id,
      _id: bundle._id,
      title: bundle.name,
      subtitle: bundle.category?.name || this.product?.categoryName,
      price: bundlePrice,
      img: bundle.image || bundle.baseProduct?.image,
      raw: mappedBundleProduct,
    };

    // ✅ NOW ALL FORMS + VERIFY APIs WORK
    // ✅ NOW ALL FORMS + VERIFY APIs WORK
    this.setMainProduct(mappedBundleProduct);

    // ✅ price explicitly set karo
    this.selectedProduct.price = Number(bundle.customPrice || bundle.finalPrice || 0);
    // ✅ reset validation only if userId changed
    this.userError = '';
    // username reset mat karo agar pehle se valid hai
    if (!this.form.userId) {
      this.username = '';
    }
    this.cdr.detectChanges();
  }

  openBundle(bundle: any) {
    this.selectedBundle = bundle;

    this.bundlePopup = true;
  }

  closeBundlePopup() {
    this.bundlePopup = false;
  }

  selectProduct(p: any) {
    if (!p?.raw) return;

    // ✅ IMPORTANT
    this.selectedProduct = p;

    this.selectedProductId = p._id || p.id;

    const prevSold = this.product?.sold;
    const prevRating = this.product?.rating;
    const prevReviews = this.product?.totalReviews;

    this.setMainProduct(p.raw);

    this.product = {
      ...this.product,
      sold: prevSold,
      rating: prevRating,
      totalReviews: prevReviews,
    };

    this.cdr.detectChanges();
  }
  increase() {
    if (this.quantity < 10) this.quantity++;
  }

  decrease() {
    if (this.quantity > 1) this.quantity--;
  }

  get totalPrice(): number {
    return this.selectedProduct ? this.selectedProduct.price * this.quantity : 0;
  }

  getServerOptions(): any[] {
    const serverField = this.forms.find((f: any) => f.name === 'server_id' || f.name === 'server');

    if (!serverField?.options) return [];

    return serverField.options.map((x: any) => (typeof x === 'string' ? { value: x, name: x } : x));
  }

  get payableAmount(): number {
    let amount = this.couponApplied ? this.finalAmount : this.totalPrice;

    if (this.useCoins && this.userCoins > 0) {
      const maxUsableCoins = Math.floor(amount * 100);

      const usableCoins = Math.min(this.userCoins, maxUsableCoins);

      const coinsDiscount = usableCoins / 100;
      amount = Math.max(0, amount - coinsDiscount);
    }

    return amount;
  }

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

  checkout() {
    this.router.navigate(['/checkout'], {
      queryParams: {
        id: this.selectedProduct?.raw?._id,

        bundleId: this.selectedProduct?.raw?.bundleId || '',

        isBundle: this.selectedProduct?.raw?.isBundle || false,

        title: this.selectedProduct?.title,
        subtitle: this.selectedProduct?.subtitle,
        image: this.selectedProduct?.raw?.category?.image || this.selectedProduct?.img,

        price: this.selectedProduct?.price,
        qty: this.quantity,

        ...(this.isLoggedIn ? {} : { email: this.form.email }),

        userId: this.form.userId,
        server: this.form.server,
        nickname: this.form.nickname,
        zone: this.form.zone,

        coupon: this.coupon?.trim() || '',
        couponDiscount: this.discount || 0,

        useCoins: this.useCoins,
        coinsUsed: this.useCoins ? Math.min(this.userCoins, Math.floor(this.totalPrice * 100)) : 0,
      },
    });
  }
}
