import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [CommonModule],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {

  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }

}