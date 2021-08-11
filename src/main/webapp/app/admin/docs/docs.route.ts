import { Route } from '@angular/router';
import { Authority } from 'app/config/authority.constants';

import { DocsComponent } from './docs.component';

export const docsRoute: Route = {
  path: '',
  component: DocsComponent,
  data: {
    pageTitle: 'API',
    authorities: [Authority.ADMIN],
  },
};
