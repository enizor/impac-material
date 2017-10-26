import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import * as DashboardAction from './dashboard.actions';
import { Dashboard } from '../_jsonapi-services/models/dashboard.model';
import { of } from 'rxjs/observable/of';

@Injectable()
export class DashboardEffects {
  // Listen for the CREATE action
  @Effect() create$: Observable<Action> = this.actions$.ofType(DashboardAction.CREATE)
    .mergeMap((action: DashboardAction.Create) => {
      // Create a new dashboard in the backend
      return Dashboard.new(action.payload)
        // If successful, dispatch success action with result
        .map(data => ({ type: DashboardAction.CREATE_SUCCESS, payload: data }))
        // If request fails, dispatch error action
        .catch(() => of({ type: DashboardAction.CREATE_ERROR }));
    });

  constructor(
    private actions$: Actions
  ) {}
}
