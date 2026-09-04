import { InjectionToken } from '@angular/core';
import { Note } from '../models/note.model';

export interface NoteRepository {
  getAll(): Promise<Note[]>;
  save(note: Note): Promise<void>;
  delete(id: string): Promise<void>;
}

export const NOTE_REPOSITORY = new InjectionToken<NoteRepository>('NOTE_REPOSITORY');
