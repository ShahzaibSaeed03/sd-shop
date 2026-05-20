import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import {
  SocialAuthService,
  SocialUser
} from '@abacritt/angularx-social-login';

import { AuthApi } from '../../../core/api/auth.api';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login-modal.html',
  styleUrl: './login-modal.css',
})
export class LoginModal implements OnInit, OnDestroy, OnChanges {

  @Input() modalType: 'points' | 'login' | 'profile' | null = null;
  @Output() onClose = new EventEmitter<void>();

  private authSub!: Subscription;

  form = {
    email: '',
    password: ''
  };

  user: any = null;

  constructor(
    private authApi: AuthApi,
    private authService: AuthService,
    private socialAuth: SocialAuthService
  ) {}

  // ================= INIT =================
  ngOnInit(): void {
    this.user = this.authService.getUser();

    this.authSub = this.socialAuth.authState.subscribe((user: SocialUser) => {
      if (!user || !user.idToken) return;
      if (this.authService.isLoggedIn()) return;
      this.handleGoogleLogin(user.idToken);
    });
  }

  // ================= ON CHANGES — fires when modalType changes from parent =================
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['modalType']?.currentValue === 'login') {
      this.renderGoogleButton();
    }
  }

  // ================= RENDER GOOGLE BUTTON =================
  renderGoogleButton(): void {
    setTimeout(() => {
      const btn = document.getElementById('google-btn-container');
      const google = (window as any).google;

      if (!btn || !google) {
        console.warn('google-btn-container or google not ready');
        return;
      }

      btn.innerHTML = '';

      google.accounts.id.renderButton(btn, {
        type: 'standard',
        shape: 'rectangular',
        theme: 'outline',
        text: 'signin_with',
        size: 'large',
        logo_alignment: 'left',
        width: 360
      });
    }, 300);
  }

  // ================= DESTROY =================
  ngOnDestroy(): void {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  // ================= GOOGLE LOGIN =================
  private handleGoogleLogin(token: string) {
    this.authApi.googleLogin(token).subscribe({
      next: (res: any) => {
        this.authService.setSession(res);
        this.user = this.authService.getUser();
        this.close();
        window.location.reload();
      },
      error: (err) => {
        console.error('Google login error:', err);
      }
    });
  }

  // ================= NORMAL LOGIN =================
  login() {
    if (!this.form.email || !this.form.password) {
      console.error('Email & Password required');
      return;
    }

    this.authApi.login(this.form).subscribe({
      next: (res: any) => {
        this.authService.setSession(res);
        this.user = this.authService.getUser();
        this.close();
        window.location.reload();
      },
      error: (err) => {
        console.error('Login error:', err);
      }
    });
  }

  // ================= LOGOUT =================
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.user = null;
    this.close();
    window.location.reload();
  }

  // ================= MODAL CONTROLS =================
  close() {
    this.modalType = null;
    this.onClose.emit();
  }

  openPoints() {
    this.modalType = 'points';
  }

  openLogin() {
    this.modalType = 'login';
    this.renderGoogleButton();
  }

  openProfile() {
    this.modalType = 'profile';
  }

  goToProfile() {
    this.close();
  }

  goToOrders() {
    this.close();
  }
}