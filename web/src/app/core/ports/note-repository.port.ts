import { InjectionToken } from '@angular/core';
import { Note } from '../models/note.model';

export interface NoteRepository {
  getAll(): Note[];
  save(note: Note): void;
  delete(id: string): void;
}

export const NOTE_REPOSITORY = new InjectionToken<NoteRepository>('NOTE_REPOSITORY');
