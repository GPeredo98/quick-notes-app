import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { RecentNotesRepository } from '../../core/ports/recent-notes-repository.port';
import { LOCAL_STORAGE_KEYS, scopedStorageKey } from './local-storage-keys';

@Injectable()
export class LocalStorageRecentNotesRepository implements RecentNotesRepository {
  private readonly authService = inject(AuthService);

  getRecentIds(): string[] {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      return [];
    }

    const raw = localStorage.getItem(scopedStorageKey(LOCAL_STORAGE_KEYS.recentNoteIds, currentUser));
    if (!raw) {
      return [];
    }
    try {
      return JSON.parse(raw) as string[];
    } catch {
      return [];
    }
  }

  saveRecentIds(ids: string[]): void {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      return;
    }

    localStorage.setItem(scopedStorageKey(LOCAL_STORAGE_KEYS.recentNoteIds, currentUser), JSON.stringify(ids));
  }
}
