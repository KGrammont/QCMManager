import { Route } from '@angular/router';
import { Authority } from 'app/config/authority.constants';

import { ConfigurationComponent } from './configuration.component';

export const configurationRoute: Route = {
  path: '',
  component: ConfigurationComponent,
  data: {
    pageTitle: 'Configuration',
    authorities: [Authority.ADMIN],
  },
};
