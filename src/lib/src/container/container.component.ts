import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { CREATE, REMOVE } from '../_store/dashboard.actions';
import * as fromRoot from '../_store/index.reducers';
import { IDashboard } from '../_jsonapi-services/models/dashboard.model';

@Component({
  selector: 'impac-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContainerComponent implements OnInit {
  dashboards$: Observable<IDashboard[]>;

  constructor(private store: Store<fromRoot.State>) {}

  ngOnInit() {
    this.dashboards$ = this.store.select('dashboards');
  }

  createDashboard() {
    console.log('### createDashboard');
    this.store.dispatch({ type: CREATE, payload: {name: 'Accounting Dashboard'} });
  }

  deleteDashboard(dashboard) {
    console.log('### deleteDashboard', dashboard);
    this.store.dispatch({ type: REMOVE, payload: dashboard });
  }
}
