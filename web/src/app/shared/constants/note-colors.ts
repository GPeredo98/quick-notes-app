import { NoteColor } from '../../core/models/note.model';

export interface NoteColorSwatch {
  value: NoteColor;
  label: string;
  swatchClass: string;
  cardClass: string;
}

export const NOTE_COLOR_SWATCHES: NoteColorSwatch[] = [
  {
    value: 'default',
    label: 'Default',
    swatchClass: 'bg-white border border-neutral-300 dark:bg-neutral-700 dark:border-neutral-500',
    cardClass: 'bg-white dark:bg-neutral-800',
  },
  { value: 'red', label: 'Red', swatchClass: 'bg-red-200', cardClass: 'bg-red-50 dark:bg-red-950/40' },
  { value: 'orange', label: 'Orange', swatchClass: 'bg-orange-200', cardClass: 'bg-orange-50 dark:bg-orange-950/40' },
  { value: 'yellow', label: 'Yellow', swatchClass: 'bg-yellow-200', cardClass: 'bg-yellow-50 dark:bg-yellow-950/40' },
  { value: 'green', label: 'Green', swatchClass: 'bg-green-200', cardClass: 'bg-green-50 dark:bg-green-950/40' },
  { value: 'blue', label: 'Blue', swatchClass: 'bg-blue-200', cardClass: 'bg-blue-50 dark:bg-blue-950/40' },
  { value: 'purple', label: 'Purple', swatchClass: 'bg-purple-200', cardClass: 'bg-purple-50 dark:bg-purple-950/40' },
  { value: 'pink', label: 'Pink', swatchClass: 'bg-pink-200', cardClass: 'bg-pink-50 dark:bg-pink-950/40' },
];

export function cardClassForColor(color: NoteColor): string {
  return NOTE_COLOR_SWATCHES.find((swatch) => swatch.value === color)?.cardClass ?? 'bg-white';
}

export const HIGHLIGHT_SWATCHES: { label: string; value: string }[] = [
  { label: 'Yellow', value: '#fef08a' },
  { label: 'Green', value: '#bbf7d0' },
  { label: 'Blue', value: '#bfdbfe' },
  { label: 'Pink', value: '#fbcfe8' },
];
