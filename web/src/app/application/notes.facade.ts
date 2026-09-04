import { Injectable, Signal, computed, effect, inject, signal } from '@angular/core';
import { AuthService } from '../core/auth/auth.service';
import { Note, NoteColor } from '../core/models/note.model';
import { DEFAULT_NOTE_OWNER, DEFAULT_NOTE_TITLE, MAX_RECENT_NOTES } from '../core/models/note.defaults';
import { NOTE_REPOSITORY } from '../core/ports/note-repository.port';
import { RECENT_NOTES_REPOSITORY } from '../core/ports/recent-notes-repository.port';

/**
 * Single source of truth for note state. Components only read signals from
 * this facade and call its methods; all persistence and business rules live
 * here so components stay presentation-only.
 */
@Injectable({ providedIn: 'root' })
export class NotesFacade {
  private readonly noteRepository = inject(NOTE_REPOSITORY);
  private readonly recentNotesRepository = inject(RECENT_NOTES_REPOSITORY);
  private readonly authService = inject(AuthService);

  private readonly notesState = signal<Note[]>([]);
  private readonly recentIdsState = signal<string[]>([]);

  constructor() {
    // Keep in-memory notes aligned with the authenticated account.
    effect(() => {
      this.authService.currentUser();
      void this.reload();
    });
  }

  private async reload(): Promise<void> {
    const [notes, recentIds] = await Promise.all([
      this.noteRepository.getAll(),
      this.recentNotesRepository.getRecentIds(),
    ]);
    this.notesState.set(notes);
    this.recentIdsState.set(recentIds);
  }

  /** All notes, pinned first, most recently updated first. */
  readonly notes: Signal<Note[]> = computed(() =>
    [...this.notesState()].sort((a, b) => {
      if (a.pinned !== b.pinned) {
        return a.pinned ? -1 : 1;
      }
      return b.updatedAt.localeCompare(a.updatedAt);
    }),
  );

  /** Notes recently opened in the detail view, newest first, shown as tabs. */
  readonly recentNotes: Signal<Note[]> = computed(() => {
    const notes = this.notesState();
    return this.recentIdsState()
      .map((id) => notes.find((note) => note.id === id))
      .filter((note): note is Note => note !== undefined);
  });

  noteById(id: string): Note | undefined {
    return this.notesState().find((note) => note.id === id);
  }

  createNote(): Note {
    const now = new Date().toISOString();
    const note: Note = {
      id: crypto.randomUUID(),
      title: DEFAULT_NOTE_TITLE,
      contentHtml: '',
      createdAt: now,
      updatedAt: now,
      owner: this.authService.currentUser() ?? DEFAULT_NOTE_OWNER,
      color: 'default',
      pinned: false,
    };
    this.notesState.update((notes) => [...notes, note]);
    void this.noteRepository.save(note);
    return note;
  }

  updateTitle(id: string, title: string): void {
    this.updateNote(id, { title: title.trim() || DEFAULT_NOTE_TITLE });
  }

  updateContent(id: string, contentHtml: string): void {
    this.updateNote(id, { contentHtml });
  }

  updateColor(id: string, color: NoteColor): void {
    this.updateNote(id, { color });
  }

  togglePinned(id: string): void {
    const note = this.noteById(id);
    if (!note) {
      return;
    }
    this.updateNote(id, { pinned: !note.pinned });
  }

  deleteNote(id: string): void {
    this.notesState.update((notes) => notes.filter((note) => note.id !== id));
    void this.noteRepository.delete(id);
    this.removeFromRecent(id);
  }

  /** Marks a note as opened, pushing it to the front of the recent tabs. */
  openNote(id: string): void {
    if (!this.noteById(id)) {
      return;
    }
    this.recentIdsState.update((ids) => {
      const withoutId = ids.filter((recentId) => recentId !== id);
      return [id, ...withoutId].slice(0, MAX_RECENT_NOTES);
    });
    void this.recentNotesRepository.saveRecentIds(this.recentIdsState());
  }

  /** Removes a note from the recent tabs without deleting the note itself. */
  removeFromRecent(id: string): void {
    this.recentIdsState.update((ids) => ids.filter((recentId) => recentId !== id));
    void this.recentNotesRepository.saveRecentIds(this.recentIdsState());
  }

  private updateNote(id: string, changes: Partial<Omit<Note, 'id' | 'createdAt'>>): void {
    let updated: Note | undefined;
    this.notesState.update((notes) =>
      notes.map((note) => {
        if (note.id !== id) {
          return note;
        }
        updated = { ...note, ...changes, updatedAt: new Date().toISOString() };
        return updated;
      }),
    );
    if (updated) {
      void this.noteRepository.save(updated);
    }
  }
}
