import { Route } from '@angular/router';
import { Authority } from 'app/config/authority.constants';

import { MetricsComponent } from './metrics.component';

export const metricsRoute: Route = {
  path: '',
  component: MetricsComponent,
  data: {
    pageTitle: 'Application Metrics',
    authorities: [Authority.ADMIN],
  },
};
