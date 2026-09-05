import { InjectionToken } from '@angular/core';

export interface RecentNotesRepository {
  getRecentIds(): Promise<string[]>;
  saveRecentIds(ids: string[]): Promise<void>;
}

export const RECENT_NOTES_REPOSITORY = new InjectionToken<RecentNotesRepository>(
  'RECENT_NOTES_REPOSITORY',
);
