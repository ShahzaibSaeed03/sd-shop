import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectorRef,
  OnInit,
  OnDestroy
} from '@angular/core';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slider.html',
  styleUrl: './slider.css',
})
export class Slider implements OnInit, OnDestroy {

  currentIndex: number = 0;
  intervalId: any;

  slides: string[] = [
    'banners/banner1.png',
    'banners/banner1.png',
    'banners/banner1.png'
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  // Start auto slider
  ngOnInit(): void {
    this.startAutoSlide();
  }

  // Clean interval (VERY IMPORTANT)
  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // Auto slide function
  startAutoSlide(): void {
    this.intervalId = setInterval(() => {
      this.next();
      this.cdr.detectChanges(); // ensures UI updates
    }, 3000);
  }

  // Next slide
  next(): void {
    this.currentIndex =
      (this.currentIndex + 1) % this.slides.length;
  }

  // Previous slide
  prev(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }

}