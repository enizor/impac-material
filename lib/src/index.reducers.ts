import { ActionReducerMap } from '@ngrx/store';
import * as fromDashboard from './dashboard/dashboard.reducer';

export interface State {
  dashboards: fromDashboard.DashboardState;
}

export const reducers: ActionReducerMap<State> = {
  dashboards: fromDashboard.reducer
};
