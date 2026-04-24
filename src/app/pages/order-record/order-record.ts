import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderApi } from '../../core/services/order.api';

@Component({
  selector: 'app-order-record',
  imports: [CommonModule],
  templateUrl: './order-record.html',
})
export class OrderRecord implements OnInit {

  constructor(private orderApi: OrderApi,private cdr: ChangeDetectorRef) {}

  // ✅ DEFAULT TAB (IMPORTANT)
  activeTab: string = 'all';

  tabs = [
    { key: 'all', label: 'All' },
    { key: 'pending_payment', label: 'To Pay' },
    { key: 'paid', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' }
  ];

  orders: any[] = [];

  // ✅ PAGINATION
  currentPage = 1;
  pageSize = 6;

  ngOnInit(): void {
    this.loadOrders();
  }

  // ==========================
  // LOAD ORDERS
  // ==========================
loadOrders() {
  this.orderApi.getMyOrders().subscribe({
    next: (res: any) => {

      this.orders = (res || []).map((o: any) => ({
        title: o.product?.name || 'Unknown Product',
        coins: this.extractCoins(o.product?.displayName),
        price: o.totalAmount || o.price,
        date: new Date(o.createdAt).toLocaleString(),
        status: o.status,
        image: o.product?.image || 'assets/no-image.png'
      }));

      this.activeTab = 'all';
      this.currentPage = 1;

      // ✅ FORCE UI UPDATE (MAIN FIX)
      this.cdr.detectChanges();

    },
    error: (err) => console.error(err)
  });
}


  // ==========================
  // EXTRACT COINS FROM NAME
  // ==========================
  extractCoins(name: string): number {
    if (!name) return 0;
    const match = name.match(/\d+/);
    return match ? +match[0] : 0;
  }

  // ==========================
  // FILTER + PAGINATION
  // ==========================
  get filteredOrders() {

    let data = this.orders;

    // ✅ SHOW ALL BY DEFAULT
    if (this.activeTab !== 'all') {
      data = data.filter(o => o.status === this.activeTab);
    }

    return data.slice(0, this.currentPage * this.pageSize);
  }

  // ==========================
  // LOAD MORE
  // ==========================
  loadMore() {
    this.currentPage++;
  }

  // ==========================
  // CHECK MORE BUTTON
  // ==========================
  hasMore() {
    let data = this.orders;

    if (this.activeTab !== 'all') {
      data = data.filter(o => o.status === this.activeTab);
    }

    return data.length > this.currentPage * this.pageSize;
  }

  // ==========================
  // TAB CHANGE
  // ==========================
  setTab(tab: string) {
    this.activeTab = tab || 'all';
    this.currentPage = 1;
  }
}