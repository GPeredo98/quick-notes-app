import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { NOTE_REPOSITORY } from './core/ports/note-repository.port';
import { RECENT_NOTES_REPOSITORY } from './core/ports/recent-notes-repository.port';
import { LocalStorageNoteRepository } from './infrastructure/persistence/local-storage-note.repository';
import { LocalStorageRecentNotesRepository } from './infrastructure/persistence/local-storage-recent-notes.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    { provide: NOTE_REPOSITORY, useClass: LocalStorageNoteRepository },
    { provide: RECENT_NOTES_REPOSITORY, useClass: LocalStorageRecentNotesRepository },
  ],
};
