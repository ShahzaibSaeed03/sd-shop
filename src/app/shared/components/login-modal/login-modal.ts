import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import {
  SocialAuthService,
  GoogleLoginProvider,
  GoogleSigninButtonDirective,
  SocialUser
} from '@abacritt/angularx-social-login';

import { AuthApi } from '../../../core/api/auth.api';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, GoogleSigninButtonDirective, RouterLink],
  templateUrl: './login-modal.html',
  styleUrl: './login-modal.css',
})
export class LoginModal implements OnInit, OnDestroy {

  @Input() modalType: 'points' | 'login' | 'profile' | null = null;
  @Output() onClose = new EventEmitter<void>();

  private authSub!: Subscription;

  // ✅ FORM
  form = {
    email: '',
    password: ''
  };

  // ✅ USER (for profile modal)
  user: any = null;

  constructor(
    private authApi: AuthApi,
    private authService: AuthService,
    private socialAuth: SocialAuthService
  ) {}

  // ================= INIT =================
  ngOnInit(): void {

    // 🔥 Load user from localStorage
    this.user = this.authService.getUser();

    // 🔥 Google auth listener
    this.authSub = this.socialAuth.authState.subscribe((user: SocialUser) => {

      // ❌ prevent duplicate login
      if (this.authService.isLoggedIn()) return;

      if (user && user.idToken) {
        this.handleGoogleLogin(user.idToken);
      }
    });
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

        // 🔥 update user instantly
        this.user = this.authService.getUser();

        this.close();

        // optional refresh (if header not updating)
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

        // 🔥 update user
        this.user = this.authService.getUser();

        this.close();

        // optional refresh
        window.location.reload();
      },
      error: (err) => {
        console.error('Login error:', err);
      }
    });
  }

  // ================= GOOGLE BUTTON =================
  loginWithGoogle() {
    this.socialAuth.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((user: SocialUser) => {

        if (!user.idToken) {
          console.error('Google idToken missing');
          return;
        }

        this.handleGoogleLogin(user.idToken);
      })
      .catch(err => console.error('Google sign-in error:', err));
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
  }

  openProfile() {
    this.modalType = 'profile';
  }

  // ================= NAVIGATION (OPTIONAL) =================
  goToProfile() {
    console.log('Go to profile page');
    this.close();
  }

  goToOrders() {
    
    this.close();
  }
}