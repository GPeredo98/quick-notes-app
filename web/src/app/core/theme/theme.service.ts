import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, signal } from '@angular/core';
import { LOCAL_STORAGE_KEYS } from '../../infrastructure/persistence/local-storage-keys';

export type ThemeMode = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly currentTheme = signal<ThemeMode>(this.readTheme());

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    this.applyTheme(this.currentTheme());
  }

  toggleTheme(): void {
    this.setTheme(this.currentTheme() === 'dark' ? 'light' : 'dark');
  }

  setTheme(theme: ThemeMode): void {
    this.currentTheme.set(theme);
    localStorage.setItem(LOCAL_STORAGE_KEYS.theme, theme);
    this.applyTheme(theme);
  }

  private readTheme(): ThemeMode {
    const storedValue = localStorage.getItem(LOCAL_STORAGE_KEYS.theme);
    return storedValue === 'light' ? 'light' : 'dark';
  }

  private applyTheme(theme: ThemeMode): void {
    const root = this.document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
    root.style.colorScheme = theme;
  }
}
