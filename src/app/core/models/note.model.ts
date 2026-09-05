export type NoteColor =
  | 'default'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink';

export interface Note {
  id: string;
  title: string;
  contentHtml: string;
  createdAt: string;
  updatedAt: string;
  owner: string;
  color: NoteColor;
  pinned: boolean;
}
