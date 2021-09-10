import { Route } from '@angular/router';
import { Authority } from 'app/config/authority.constants';

import { RegisterComponent } from './register.component';

export const registerRoute: Route = {
  path: 'register',
  component: RegisterComponent,
  data: {
    pageTitle: 'Inscription',
    authorities: [Authority.ADMIN],
  },
};
