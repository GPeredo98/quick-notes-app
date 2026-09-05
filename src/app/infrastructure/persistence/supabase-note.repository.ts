import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { Note } from '../../core/models/note.model';
import { DEFAULT_NOTE_OWNER } from '../../core/models/note.defaults';
import { NoteRepository } from '../../core/ports/note-repository.port';
import { supabase } from '../../core/supabase/supabase-client';
import { NoteRow, mapNoteToRow, mapRowToNote } from './note.mapper';

@Injectable()
export class SupabaseNoteRepository implements NoteRepository {
  private readonly authService = inject(AuthService);

  async getAll(): Promise<Note[]> {
    const userId = this.authService.currentUserId();
    if (!userId) {
      return [];
    }

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Failed to load notes', error);
      return [];
    }

    const owner = this.authService.currentUser() ?? DEFAULT_NOTE_OWNER;
    return (data as NoteRow[]).map((row) => mapRowToNote(row, owner));
  }

  async save(note: Note): Promise<void> {
    const userId = this.authService.currentUserId();
    if (!userId) {
      return;
    }

    const { error } = await supabase.from('notes').upsert(mapNoteToRow(note, userId));
    if (error) {
      console.error('Failed to save note', error);
    }
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (error) {
      console.error('Failed to delete note', error);
    }
  }
}
