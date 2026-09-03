export const LOCAL_STORAGE_KEYS = {
  notes: 'qn.notes',
  recentNoteIds: 'qn.recent-note-ids',
  accounts: 'qn.accounts',
  sessionUser: 'qn.session-user',
  theme: 'qn.theme',
} as const;

export function scopedStorageKey(baseKey: string, email: string): string {
  return `${baseKey}.${email}`;
}
