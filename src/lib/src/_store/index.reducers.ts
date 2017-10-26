import { ActionReducerMap } from '@ngrx/store';
import * as fromDashboard from './dashboard.reducer';
import {IDashboard} from '../_jsonapi-services/models/dashboard.model';

export interface State {
  dashboards: IDashboard[];
}

export const reducers: ActionReducerMap<State> = {
  dashboards: fromDashboard.reducer
};
