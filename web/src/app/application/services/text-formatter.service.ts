import { Injectable } from '@angular/core';

/**
 * Formatting actions supported by the note editor today. Add new entries to
 * `COMMANDS` (and, if needed, a dedicated apply method) to scale this list up.
 */
export type TextFormatAction = 'bold' | 'italic' | 'underline' | 'strikeThrough' | 'highlight';

const COMMANDS: Record<TextFormatAction, string> = {
  bold: 'bold',
  italic: 'italic',
  underline: 'underline',
  strikeThrough: 'strikeThrough',
  highlight: 'hiliteColor',
};

const HIGHLIGHT_NONE = 'transparent';

/**
 * Applies rich-text formatting to the current editor selection using the
 * browser's contenteditable command set. Kept isolated from the rest of the
 * app so richer formatting (headings, lists, links, etc.) can be added here
 * later without touching components or the notes facade.
 */
@Injectable({ providedIn: 'root' })
export class TextFormatterService {
  toggle(action: 'bold' | 'italic' | 'underline' | 'strikeThrough'): void {
    document.execCommand(COMMANDS[action], false);
  }

  applyHighlight(color: string): void {
    document.execCommand(COMMANDS.highlight, false, color);
  }

  clearHighlight(): void {
    document.execCommand(COMMANDS.highlight, false, HIGHLIGHT_NONE);
  }

  isActive(action: TextFormatAction): boolean {
    try {
      return document.queryCommandState(COMMANDS[action]);
    } catch {
      return false;
    }
  }
}
