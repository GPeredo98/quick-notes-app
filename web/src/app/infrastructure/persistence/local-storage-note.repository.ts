import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { Note } from '../../core/models/note.model';
import { NoteRepository } from '../../core/ports/note-repository.port';
import { LOCAL_STORAGE_KEYS, scopedStorageKey } from './local-storage-keys';

@Injectable()
export class LocalStorageNoteRepository implements NoteRepository {
  private readonly authService = inject(AuthService);

  getAll(): Note[] {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      return [];
    }

    const raw = localStorage.getItem(scopedStorageKey(LOCAL_STORAGE_KEYS.notes, currentUser));
    if (!raw) {
      return [];
    }
    try {
      return JSON.parse(raw) as Note[];
    } catch {
      return [];
    }
  }

  save(note: Note): void {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      return;
    }

    const notes = this.getAll();
    const index = notes.findIndex((existing) => existing.id === note.id);
    if (index === -1) {
      notes.push(note);
    } else {
      notes[index] = note;
    }
    this.persist(notes, currentUser);
  }

  delete(id: string): void {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      return;
    }

    const notes = this.getAll().filter((note) => note.id !== id);
    this.persist(notes, currentUser);
  }

  private persist(notes: Note[], currentUser: string): void {
    localStorage.setItem(scopedStorageKey(LOCAL_STORAGE_KEYS.notes, currentUser), JSON.stringify(notes));
  }
}
