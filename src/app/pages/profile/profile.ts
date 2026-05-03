import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  user: any = null;
  cashback: number = 0;

  constructor(private router: Router,  private authService: AuthService
) {}

ngOnInit(): void {
  this.loadUser();
  this.loadCashback(); // 🔥 ADD THIS
}

  // ✅ LOAD USER FROM LOCAL STORAGE
  loadUser() {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      const parsed = JSON.parse(storedUser);

      this.user = {
        name: parsed.name || 'User',
        avatar: parsed.picture || '/login/google.png',
        provider: parsed.provider || 'local',
        memberSince: this.formatDate(parsed.createdAt),
      };
    } else {
      // ❌ if not logged in redirect
      this.router.navigate(['/']);
    }

    // 🔥 optional (later from API)
  }
loadCashback() {
  this.authService.getCashback().subscribe({
    next: (res: any) => {
      this.cashback = res.points || 0;
    },
    error: () => {
      this.cashback = 0;
    }
  });
}
  // ✅ FORMAT DATE
  formatDate(date: string) {
    if (!date) return '-';

    const d = new Date(date);

    return d.toLocaleString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  }

  // ✅ LOGOUT
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.router.navigate(['/']);

    // optional full reload
    setTimeout(() => window.location.reload(), 100);
  }

  // ✅ NAVIGATION
  goToOrders() {
    this.router.navigate(['/orders']);
  }
}
