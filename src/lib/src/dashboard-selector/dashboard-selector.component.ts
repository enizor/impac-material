import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { CREATE, INIT, REMOVE, SELECT } from '../_store/dashboard.actions';
import * as fromRoot from '../_store/index.reducers';
import { Dashboard } from '../_models/dashboard.model';

@Component({
  selector: 'impac-dashboard-selector',
  templateUrl: './dashboard-selector.component.html',
  styleUrls: ['./dashboard-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardSelectorComponent implements OnInit {
  dashboards$: Observable<Dashboard[]>;

  constructor(private store: Store<fromRoot.State>) {}

  ngOnInit() {
    this.dashboards$ = this.store.select('dashboards');
    this.store.dispatch({ type: INIT });
  }

  createDashboard() {
    console.log('### DEBUG createDashboard');
    this.store.dispatch({ type: CREATE, payload: Object.assign(new Dashboard(), {name: 'Accounting Dashboard'}) });
  }

  selectDashboard(dashboard: Dashboard) {
    console.log('### DEBUG selectDashboard', dashboard);
    this.store.dispatch({ type: SELECT, index: dashboard.id });
  }

  deleteDashboard(dashboard: Dashboard) {
    console.log('### DEBUG deleteDashboard', dashboard);
    this.store.dispatch({ type: REMOVE, payload: dashboard });
  }

}
