import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectorRef,
  OnInit,
  OnDestroy
} from '@angular/core';
import { BannerApi } from '../../../core/services/banner.api';


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

  // 🔥 dynamic slides
  slides: string[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private bannerApi: BannerApi
  ) {}

  ngOnInit(): void {
    this.getBanners();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // ✅ CALL API HERE
getBanners(): void {
  const isMobile = window.innerWidth < 768;

  this.bannerApi.getBanners().subscribe({
    next: (res: any[]) => {

      this.slides = res
        .filter(b => b.isActive)
        .sort((a, b) => a.order - b.order)
        .map(b => isMobile
          ? (b.mobileImage || b.desktopImage)
          : b.desktopImage
        );

      this.startAutoSlide();
    }
  });
}


  startAutoSlide(): void {
    if (!this.slides.length) return;

    this.intervalId = setInterval(() => {
      this.next();
      this.cdr.detectChanges();
    }, 3000);
  }

  next(): void {
    this.currentIndex =
      (this.currentIndex + 1) % this.slides.length;
  }

  prev(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }
}