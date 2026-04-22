import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./shared/components/header/header";
import { Footer } from "./shared/components/footer/footer";
import { LoginModal } from "./shared/components/login-modal/login-modal";
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, LoginModal, CommonModule,],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

    constructor(private auth: AuthService) {
    // ✅ APP START hote hi session restore
    this.auth.loadUser();
  }
modalType: 'login' | 'points' | 'profile' | null = null;

handleModal(type: any) {
  this.modalType = type;
}

  protected readonly title = signal('SD-Shop');
}
