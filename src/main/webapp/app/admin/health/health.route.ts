import { Route } from '@angular/router';
import { Authority } from 'app/config/authority.constants';

import { HealthComponent } from './health.component';

export const healthRoute: Route = {
  path: '',
  component: HealthComponent,
  data: {
    pageTitle: 'Health Checks',
    authorities: [Authority.ADMIN],
  },
};
