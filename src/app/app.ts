import { Component, signal } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

import { Header } from "./shared/components/header/header";
import { Footer } from "./shared/components/footer/footer";
import { LoginModal } from "./shared/components/login-modal/login-modal";
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, LoginModal, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  isHomePage = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {

    this.auth.loadUser();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isHomePage = this.router.url === '/';
      });
  }

  modalType: 'login' | 'points' | 'profile' | null = null;

  handleModal(type: any) {
    this.modalType = type;
  }

  protected readonly title = signal('SD-Shop');
}