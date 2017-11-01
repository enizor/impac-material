import { ActionReducerMap } from '@ngrx/store';
import * as fromDashboard from './dashboard.reducer';
import { Dashboard } from '../_models/dashboard.model';

export interface State {
  dashboards: Array<Dashboard>;
}

export const reducers: ActionReducerMap<State> = {
  dashboards: fromDashboard.reducer
};
