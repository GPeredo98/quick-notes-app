import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  untracked,
  viewChild,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ArrowLeft, LucideAngularModule, Pin, Trash2 } from 'lucide-angular';
import { NotesFacade } from '../../application/notes.facade';
import { NoteColor } from '../../core/models/note.model';
import { NOTE_COLOR_SWATCHES } from '../../shared/constants/note-colors';
import { debounce } from '../../shared/utils/debounce.util';
import { FormattingToolbarComponent } from '../../shared/ui/formatting-toolbar/formatting-toolbar.component';
import { RecentTabsComponent } from '../../shared/ui/recent-tabs/recent-tabs.component';

@Component({
  selector: 'qn-note-detail-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule, RouterLink, DatePipe, FormattingToolbarComponent, RecentTabsComponent],
  templateUrl: './note-detail.page.html',
})
export class NoteDetailPage {
  private readonly facade = inject(NotesFacade);
  private readonly router = inject(Router);

  readonly id = input.required<string>();

  protected readonly note = computed(() => this.facade.notes().find((n) => n.id === this.id()));
  protected readonly recentNotes = this.facade.recentNotes;
  protected readonly colorSwatches = NOTE_COLOR_SWATCHES;
  protected readonly backIcon = ArrowLeft;
  protected readonly pinIcon = Pin;
  protected readonly trashIcon = Trash2;

  private readonly titleInput = viewChild<ElementRef<HTMLInputElement>>('titleInput');
  private readonly editor = viewChild<ElementRef<HTMLDivElement>>('editor');

  private readonly saveTitle = debounce((id: string, title: string) => this.facade.updateTitle(id, title), 300);
  private readonly saveContent = debounce((id: string, html: string) => this.facade.updateContent(id, html), 300);

  constructor() {
    // Track this note as opened (recent tabs) whenever the route id changes,
    // or bounce back to the list if the note no longer exists.
    effect(() => {
      const id = this.id();
      untracked(() => {
        if (this.facade.noteById(id)) {
          this.facade.openNote(id);
        } else {
          this.router.navigate(['/']);
        }
      });
    });

    // Load the note content into the editor/title fields imperatively, only
    // when switching notes, so typing never gets fought by a re-binding.
    effect(() => {
      const id = this.id();
      const editorEl = this.editor();
      const titleEl = this.titleInput();
      if (!editorEl || !titleEl) {
        return;
      }
      const note = untracked(() => this.facade.noteById(id));
      editorEl.nativeElement.innerHTML = note?.contentHtml ?? '';
      titleEl.nativeElement.value = note?.title ?? '';
    });
  }

  protected onTitleInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.saveTitle(this.id(), value);
  }

  protected onContentInput(event: Event): void {
    const value = (event.target as HTMLDivElement).innerHTML;
    this.saveContent(this.id(), value);
  }

  protected selectColor(color: NoteColor): void {
    this.facade.updateColor(this.id(), color);
  }

  protected togglePinned(): void {
    this.facade.togglePinned(this.id());
  }

  protected deleteNote(): void {
    this.facade.deleteNote(this.id());
    this.router.navigate(['/']);
  }

  protected openRecentNote(id: string): void {
    this.router.navigate(['/note', id]);
  }

  protected closeRecentTab(id: string): void {
    const wasActiveTab = id === this.id();
    this.facade.removeFromRecent(id);
    if (wasActiveTab) {
      const next = this.recentNotes()[0];
      this.router.navigate(next ? ['/note', next.id] : ['/']);
    }
  }
}
