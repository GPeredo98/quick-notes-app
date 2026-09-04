import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { RecentNotesRepository } from '../../core/ports/recent-notes-repository.port';
import { supabase } from '../../core/supabase/supabase-client';

/** Recent tab ids are stored as a jsonb array on the `profiles` row (column `recent_note_ids`). */
@Injectable()
export class SupabaseRecentNotesRepository implements RecentNotesRepository {
  private readonly authService = inject(AuthService);

  async getRecentIds(): Promise<string[]> {
    const userId = this.authService.currentUserId();
    if (!userId) {
      return [];
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('recent_note_ids')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Failed to load recent notes', error);
      return [];
    }

    return (data?.recent_note_ids as string[] | null) ?? [];
  }

  async saveRecentIds(ids: string[]): Promise<void> {
    const userId = this.authService.currentUserId();
    if (!userId) {
      return;
    }

    const { error } = await supabase.from('profiles').upsert({ id: userId, recent_note_ids: ids });
    if (error) {
      console.error('Failed to save recent notes', error);
    }
  }
}
