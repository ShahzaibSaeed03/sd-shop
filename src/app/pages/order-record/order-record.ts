import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Order {
  title: string;
  coins: number;
  price: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
  image: string;
}

@Component({
  selector: 'app-order-record',
  imports: [CommonModule],
  templateUrl: './order-record.html',
  styleUrl: './order-record.css',
})
export class OrderRecord {

  activeTab: string = 'all';

  tabs = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'To Pay' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' }
  ];

  orders: Order[] = [
    {
      title: 'Zenless Zone Zero',
      coins: 300,
      price: 200,
      date: '16/10/2025, 03:29:14',
      status: 'completed',
      image: 'https://via.placeholder.com/60'
    },
    {
      title: 'Zenless Zone Zero',
      coins: 300,
      price: 200,
      date: '16/10/2025, 03:29:14',
      status: 'completed',
      image: 'https://via.placeholder.com/60'
    },
    {
      title: 'Zenless Zone Zero',
      coins: 300,
      price: 200,
      date: '16/10/2025, 03:29:14',
      status: 'completed',
      image: 'https://via.placeholder.com/60'
    },
    {
      title: 'Zenless Zone Zero',
      coins: 300,
      price: 200,
      date: '16/10/2025, 03:29:14',
      status: 'completed',
      image: 'https://via.placeholder.com/60'
    }
  ];

  get filteredOrders() {
    if (this.activeTab === 'all') return this.orders;
    return this.orders.filter(o => o.status === this.activeTab);
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }
}