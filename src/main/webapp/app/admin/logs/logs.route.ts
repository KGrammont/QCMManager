import { Route } from '@angular/router';
import { Authority } from 'app/config/authority.constants';

import { LogsComponent } from './logs.component';

export const logsRoute: Route = {
  path: '',
  component: LogsComponent,
  data: {
    pageTitle: 'Logs',
    authorities: [Authority.ADMIN],
  },
};
