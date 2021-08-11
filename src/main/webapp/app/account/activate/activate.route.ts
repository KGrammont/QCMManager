import { Route } from '@angular/router';
import { Authority } from 'app/config/authority.constants';

import { ActivateComponent } from './activate.component';

export const activateRoute: Route = {
  path: 'activate',
  component: ActivateComponent,
  data: {
    pageTitle: 'Activation',
    authorities: [Authority.ADMIN, Authority.PROF],
  },
};
