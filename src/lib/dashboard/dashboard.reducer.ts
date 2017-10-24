import * as DashboardActions from './dashboard.actions';
import { Dashboard } from '../_model/dashboard.model';

const defaultState: DashboardState = {
  dashboards: [{name: 'Default Dashboard'}]
};

export interface DashboardState {
  dashboards: Dashboard[];
}

export function reducer(state: DashboardState = defaultState, action: DashboardActions.All): DashboardState {
  console.log('### in dashboardReducer:', action, state);

  switch (action.type) {
    case DashboardActions.CREATE:
      return {
        dashboards: [
          ...state.dashboards,
          (<DashboardActions.Create> action).payload
        ]
      };

    case DashboardActions.UPDATE:
      return state;

    case DashboardActions.REMOVE:
      return state;

    default:
      return state;
  }
}
