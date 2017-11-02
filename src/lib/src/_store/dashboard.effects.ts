import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import * as DashboardAction from './dashboard.actions';
import { Dashboard } from '../_models/dashboard.model';
import { of } from 'rxjs/observable/of';
import { HttpClient } from '@angular/common/http';
import { JsonapiService } from '../_ngrx-jsonapi/services/jsonapi-service';

@Injectable()
export class DashboardEffects {
  // Listen for the INIT action
  @Effect() init$: Observable<Action> = this.actions$.ofType(DashboardAction.INIT)
    .mergeMap(() => {
      // Fetch the list of dashboards in the backend
      return this.jsonapiService.findAll(Dashboard)
        // If successful, dispatch success action with result
        .map((res: any) => ({ type: DashboardAction.INIT_SUCCESS, payload: res }))
        // If request fails, dispatch error action
        .catch((error) => of({ type: DashboardAction.INIT_ERROR, payload: error }));
    });

  // Listen for the CREATE action
  @Effect() create$: Observable<Action> = this.actions$.ofType(DashboardAction.CREATE)
    .mergeMap((action: DashboardAction.Create) => {
      // Create a new dashboard in the backend
      console.log('### DEBUG CREATE effect', { data: action.payload });
      return this.http.post('/api/mnoe/v2/dashboards', action.payload)
        // If successful, dispatch success action with result
        .map(data => {
          console.log('### DEBUG data', data);
          return { type: DashboardAction.CREATE_SUCCESS, payload: data };
        })
        // If request fails, dispatch error action
        .catch((error) => of({ type: DashboardAction.CREATE_ERROR, payload: error }));
    });

  @Effect() remove$: Observable<Action> = this.actions$.ofType(DashboardAction.REMOVE)
    .mergeMap((action: DashboardAction.Remove) => {
      // Delete a dashboard in the backend
      return this.jsonapiService.deleteRecord(Dashboard, action.payload.id)
        // If successful, dispatch success action with deleted object
        .map((data) => ({ type: DashboardAction.REMOVE_SUCCESS, payload: action.payload }))
        // If request fails, dispatch error action
        .catch((error) => of({ type: DashboardAction.REMOVE_ERROR, payload: error }));
    });

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private jsonapiService: JsonapiService
  ) {}
}
