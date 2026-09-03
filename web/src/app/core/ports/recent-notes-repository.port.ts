import { InjectionToken } from '@angular/core';

export interface RecentNotesRepository {
  getRecentIds(): string[];
  saveRecentIds(ids: string[]): void;
}

export const RECENT_NOTES_REPOSITORY = new InjectionToken<RecentNotesRepository>(
  'RECENT_NOTES_REPOSITORY',
);
