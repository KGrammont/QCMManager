import { Routes } from '@angular/router';

import { ErrorComponent } from './error.component';

export const errorRoute: Routes = [
  {
    path: 'error',
    component: ErrorComponent,
    data: {
      pageTitle: "Page d'erreur!",
    },
  },
  {
    path: 'accessdenied',
    component: ErrorComponent,
    data: {
      pageTitle: "Page d'erreur!",
      errorMessage: "Vous n'êtes pas autorisé à voir cette page.",
    },
  },
  {
    path: '404',
    component: ErrorComponent,
    data: {
      pageTitle: "Page d'erreur!",
      errorMessage: "Cette page n'existe pas.",
    },
  },
  {
    path: '**',
    redirectTo: '/404',
  },
];
