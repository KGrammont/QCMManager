import { Route } from '@angular/router';
import { Authority } from 'app/config/authority.constants';

import { PasswordResetFinishComponent } from './password-reset-finish.component';

export const passwordResetFinishRoute: Route = {
  path: 'reset/finish',
  component: PasswordResetFinishComponent,
  data: {
    pageTitle: 'Mot de passe',
    authorities: [Authority.ADMIN, Authority.PROF],
  },
};
