import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { CREATE, INIT, REMOVE } from '../_store/dashboard.actions';
import * as fromRoot from '../_store/index.reducers';
import { Dashboard } from '../_models/dashboard.model';

@Component({
  selector: 'impac-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContainerComponent implements OnInit {
  dashboards$: Observable<Dashboard[]>;

  constructor(private store: Store<fromRoot.State>) {}

  ngOnInit() {
    this.dashboards$ = this.store.select('dashboards');
    this.store.dispatch({ type: INIT });
  }

  createDashboard() {
    console.log('### createDashboard');
    this.store.dispatch({ type: CREATE, payload: {name: 'Accounting Dashboard'} });
  }

  deleteDashboard(dashboard: Dashboard) {
    console.log('### deleteDashboard', dashboard);
    this.store.dispatch({ type: REMOVE, payload: dashboard });
  }
}
