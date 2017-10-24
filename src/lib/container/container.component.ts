import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { CREATE } from '../dashboard/dashboard.actions';
import { DashboardState } from '../dashboard/dashboard.reducer';
import * as fromRoot from '../index.reducers';

@Component({
  selector: 'impac-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContainerComponent implements OnInit {
  dashboards$: Observable<DashboardState>;

  constructor(private store: Store<fromRoot.State>) {}

  ngOnInit() {
    this.dashboards$ = this.store.select('dashboards');
  }

  create() {
    this.store.dispatch({ type: CREATE, payload: {name: 'Accounting Dashboard'} });
  }
}
