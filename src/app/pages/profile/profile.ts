import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {

  user = {
    name: 'John Alex',
    avatar: 'https://i.pravatar.cc/100',
    provider: 'Google',
    memberSince: 'Feb 2026'
  };

  cashback = 50;

  logout() {
    console.log('Logout clicked');
  }

}

