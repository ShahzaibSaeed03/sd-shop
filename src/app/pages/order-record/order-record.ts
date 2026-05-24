import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  OrderApi
} from '../../core/services/order.api';

import {
  SupportService
} from '../../shared/service/support.service';

@Component({
  selector: 'app-order-record',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-record.html',
})
export class OrderRecord implements OnInit {

  constructor(
    private orderApi: OrderApi,
    private cdr: ChangeDetectorRef,
    public supportService: SupportService
  ) {}

  // FILTER DROPDOWN
  showSortDropdown = false;

  sortType: 'high' | 'low' | null = null;

  // ACTIVE TAB
  activeTab: string = 'all';

  // PAGINATION
  currentPage = 1;

  pageSize = 6;

  // DATA
  orders: any[] = [];

  // TABS
  tabs = [
    {
      key: 'all',
      label: 'Todos'
    },
    {
      key: 'pending_payment',
      label: 'A pagar'
    },
    {
      key: 'paid',
      label: 'Concluídos'
    },
    {
      key: 'cancelled',
      label: 'Cancelados'
    }
  ];

  ngOnInit(): void {

    this.loadOrders();

  }

  // LOAD ORDERS
  loadOrders() {

    this.orderApi.getMyOrders().subscribe({

      next: (res: any) => {

        this.orders = (res || []).map((o: any) => ({

          // PRODUCT NAME
          title:
            o.product?.name ||
            'Produto desconhecido',

          // CATEGORY
          categoryName:
            o.product?.categoryName || '',

          // COINS
          coins:
            this.extractCoins(
              o.product?.displayName
            ),

          // PRICE
          price:
            o.totalAmount || o.price,

          // DATE
          date:
            new Date(o.createdAt)
              .toLocaleString('pt-BR'),

          // STATUS
          status:
            o.status,

          // IMAGE
          image:
            o.product?.image ||
            'assets/no-image.png',

          // CASHBACK
          cashbackEarned:
            o.cashbackEarned || 0,

          cashbackCoins:
            o.cashbackCoins ||
            Math.floor(
              (o.cashbackEarned || 0) * 100
            )

        }));

        this.currentPage = 1;

        this.activeTab = 'all';

        this.cdr.detectChanges();

      },

      error: (err) => {

        console.log(err);

      }

    });

  }

  // SORT
  toggleSortDropdown() {

    this.showSortDropdown =
      !this.showSortDropdown;

  }

  sortOrders(type: 'high' | 'low') {

    this.sortType = type;

    this.showSortDropdown = false;

    if (type === 'high') {

      this.orders.sort(
        (a, b) =>
          Number(b.price) -
          Number(a.price)
      );

    } else {

      this.orders.sort(
        (a, b) =>
          Number(a.price) -
          Number(b.price)
      );

    }

    this.currentPage = 1;

    this.cdr.detectChanges();

  }

  // EXTRACT COINS
  extractCoins(name: string): number {

    if (!name) {
      return 0;
    }

    const match =
      name.match(/\d+/);

    return match
      ? +match[0]
      : 0;

  }

  // FILTERED DATA
  get filteredOrders() {

    let data = this.orders;

    if (this.activeTab !== 'all') {

      data = data.filter(
        o => o.status === this.activeTab
      );

    }

    const start =
      (this.currentPage - 1) *
      this.pageSize;

    const end =
      start + this.pageSize;

    return data.slice(start, end);

  }

  // TOTAL PAGES
  get totalPages(): number {

    let data = this.orders;

    if (this.activeTab !== 'all') {

      data = data.filter(
        o => o.status === this.activeTab
      );

    }

    return Math.ceil(
      data.length / this.pageSize
    );

  }

  // PAGE ARRAY
  get pages(): number[] {

    return Array.from(
      { length: this.totalPages },
      (_, i) => i + 1
    );

  }

  // NEXT PAGE
  nextPage() {

    if (
      this.currentPage <
      this.totalPages
    ) {

      this.currentPage++;

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    }

  }

  // PREV PAGE
  prevPage() {

    if (
      this.currentPage > 1
    ) {

      this.currentPage--;

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    }

  }

  // GO TO PAGE
  goToPage(page: number) {

    this.currentPage = page;

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }

  // TAB CHANGE
  setTab(tab: string) {

    this.activeTab =
      tab || 'all';

    this.currentPage = 1;

  }

}