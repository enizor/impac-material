import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import * as DashboardAction from './dashboard.actions';
import { Dashboard } from '../_models/dashboard.model';
import { ErrorResponse } from '../_ngrx-jsonapi/models/error-response.model';
import { MnohubService } from '../_service/mnohub-service';

@Injectable()
export class DashboardEffects {
  // Listen for the INIT action
  @Effect() init$: Observable<Action> = this.actions$.ofType(DashboardAction.INIT)
    .mergeMap(() => {
      // Fetch the list of dashboards in the backend
      return this.mnohubService.findAll(Dashboard, {include: 'widgets'})
        // If successful, dispatch success action with result
        .map((res: any) => ({ type: DashboardAction.INIT_SUCCESS, payload: res }))
        // If request fails, dispatch error action
        .catch((error: ErrorResponse) => of({ type: DashboardAction.INIT_ERROR, payload: error }));
    });

  // Listen for the CREATE action
  @Effect() create$: Observable<Action> = this.actions$.ofType(DashboardAction.CREATE)
    .mergeMap((action: DashboardAction.Create) => {
      // Create a new dashboard in the backend
      return this.mnohubService.saveRecord(action.payload)
        // If successful, dispatch success action with result
        .map(data => ({ type: DashboardAction.CREATE_SUCCESS, payload: data }) )
        // If request fails, dispatch error action
        .catch((error: ErrorResponse) => of({ type: DashboardAction.CREATE_ERROR, payload: error }));
    });

  @Effect() remove$: Observable<Action> = this.actions$.ofType(DashboardAction.REMOVE)
    .mergeMap((action: DashboardAction.Remove) => {
      // Delete a dashboard in the backend
      return this.mnohubService.deleteRecord(Dashboard, action.payload.id)
        // If successful, dispatch success action with deleted object
        .map((data) => ({ type: DashboardAction.REMOVE_SUCCESS, payload: action.payload }))
        // If request fails, dispatch error action
        .catch((error: ErrorResponse) => of({ type: DashboardAction.REMOVE_ERROR, payload: error }));
    });

  constructor(
    private actions$: Actions,
    private mnohubService: MnohubService
  ) {}
}
