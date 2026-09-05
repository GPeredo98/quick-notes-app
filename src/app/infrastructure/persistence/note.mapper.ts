import { Note, NoteColor } from '../../core/models/note.model';

/** Shape of a row in the `notes` table (see Supabase schema notes). */
export interface NoteRow {
  id: string;
  user_id: string;
  title: string;
  content_html: string;
  color: NoteColor;
  pinned: boolean;
  created_at: string;
  updated_at: string;
}

export function mapRowToNote(row: NoteRow, ownerEmail: string): Note {
  return {
    id: row.id,
    title: row.title,
    contentHtml: row.content_html,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    owner: ownerEmail,
    color: row.color,
    pinned: row.pinned,
  };
}

export function mapNoteToRow(note: Note, userId: string): NoteRow {
  return {
    id: note.id,
    user_id: userId,
    title: note.title,
    content_html: note.contentHtml,
    color: note.color,
    pinned: note.pinned,
    created_at: note.createdAt,
    updated_at: note.updatedAt,
  };
}
