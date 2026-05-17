// src/app/core/services/support.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SupportService {
  // Signal-based state — works with OnPush automatically
  readonly isOpen = signal(false);

  open() {
    this.isOpen.set(true);
    // ❌ Do NOT scroll — the modal is fixed-positioned, no scroll needed
  }

  close() {
    this.isOpen.set(false);
  }

  toggle() {
    this.isOpen.update(v => !v);
  }
}