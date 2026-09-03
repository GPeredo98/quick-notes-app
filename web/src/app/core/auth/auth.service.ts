import { Injectable, signal } from '@angular/core';
import { LOCAL_STORAGE_KEYS } from '../../infrastructure/persistence/local-storage-keys';

interface StoredAccount {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly currentUser = signal<string | null>(this.readSessionUser());

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  login(email: string, password: string): AuthResult {
    const normalizedEmail = this.normalizeEmail(email);
    if (!normalizedEmail || !password.trim()) {
      return { success: false, message: 'Email and password are required.' };
    }

    const account = this.readAccounts().find((entry) => entry.email === normalizedEmail);
    if (!account || account.password !== password) {
      return { success: false, message: 'Invalid credentials.' };
    }

    this.setSession(normalizedEmail);
    return { success: true };
  }

  register(email: string, password: string): AuthResult {
    const normalizedEmail = this.normalizeEmail(email);
    if (!normalizedEmail || !password.trim()) {
      return { success: false, message: 'Email and password are required.' };
    }
    if (password.length < 4) {
      return { success: false, message: 'Password must contain at least 4 characters.' };
    }

    const accounts = this.readAccounts();
    if (accounts.some((entry) => entry.email === normalizedEmail)) {
      return { success: false, message: 'This account already exists.' };
    }

    accounts.push({ email: normalizedEmail, password });
    this.saveAccounts(accounts);
    this.setSession(normalizedEmail);
    return { success: true };
  }

  logout(): void {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.sessionUser);
    this.currentUser.set(null);
  }

  private setSession(email: string): void {
    localStorage.setItem(LOCAL_STORAGE_KEYS.sessionUser, email);
    this.currentUser.set(email);
  }

  private readSessionUser(): string | null {
    const value = localStorage.getItem(LOCAL_STORAGE_KEYS.sessionUser);
    if (!value) {
      return null;
    }

    const normalizedEmail = this.normalizeEmail(value);
    if (!normalizedEmail) {
      return null;
    }

    const accountExists = this.readAccounts().some((entry) => entry.email === normalizedEmail);
    if (!accountExists) {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.sessionUser);
      return null;
    }

    return normalizedEmail;
  }

  private readAccounts(): StoredAccount[] {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.accounts);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as StoredAccount[];
      return parsed.filter((entry) => !!this.normalizeEmail(entry.email));
    } catch {
      return [];
    }
  }

  private saveAccounts(accounts: StoredAccount[]): void {
    localStorage.setItem(LOCAL_STORAGE_KEYS.accounts, JSON.stringify(accounts));
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}
