import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';
import { Note } from '../../../core/models/note.model';

@Component({
  selector: 'qn-recent-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  templateUrl: './recent-tabs.component.html',
})
export class RecentTabsComponent {
  readonly notes = input.required<Note[]>();
  readonly activeId = input.required<string>();

  readonly select = output<string>();
  readonly close = output<string>();

  protected readonly closeIcon = X;
}
