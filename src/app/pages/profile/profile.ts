import { CommonModule } from '@angular/common';

import {
  Component,
  OnInit
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  AuthService
} from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {

  user: any = null;

  cashback: number = 0;

  isCashbackLoading = true;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    this.loadUser();

    this.loadCashback();

  }

  // LOAD USER
  loadUser() {

    const storedUser =
      localStorage.getItem('user');

    if (storedUser) {

      const parsed =
        JSON.parse(storedUser);

      this.user = {

        name:
          parsed.name || 'User',

        avatar:
          parsed.picture ||
          '/login/google.png',

        provider:
          parsed.provider || 'local',

        memberSince:
          this.formatDate(
            parsed.createdAt
          ),

      };

    } else {

      // NOT LOGGED IN
      this.router.navigate(['/']);

    }

  }

  // LOAD CASHBACK
  loadCashback() {

    this.isCashbackLoading = true;

    this.authService
      .getCashback()
      .subscribe({

        next: (res: any) => {

          this.cashback =
            res?.points || 0;

          this.isCashbackLoading = false;

        },

        error: () => {

          this.cashback = 0;

          this.isCashbackLoading = false;

        }

      });

  }

  // FORMAT DATE
  formatDate(date: string) {

    if (!date) {
      return '-';
    }

    const d =
      new Date(date);

    return d.toLocaleString(
      'en-US',
      {
        month: 'short',
        year: 'numeric',
      }
    );

  }

  // LOGOUT
  logout() {

    localStorage.removeItem('token');

    localStorage.removeItem('user');

    this.router.navigate(['/']);

    // OPTIONAL REFRESH
    setTimeout(() => {

      window.location.reload();

    }, 100);

  }

  // GO TO ORDERS
  goToOrders() {

    this.router.navigate(['/orders']);

  }

}