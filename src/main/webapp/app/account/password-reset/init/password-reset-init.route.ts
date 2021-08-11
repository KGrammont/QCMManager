import { Route } from '@angular/router';
import { Authority } from 'app/config/authority.constants';

import { PasswordResetInitComponent } from './password-reset-init.component';

export const passwordResetInitRoute: Route = {
  path: 'reset/request',
  component: PasswordResetInitComponent,
  data: {
    pageTitle: 'Mot de passe',
    authorities: [Authority.ADMIN, Authority.PROF],
  },
};
