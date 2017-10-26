import * as DashboardActions from './dashboard.actions';
import { IDashboard } from '../_jsonapi-services/models/dashboard.model';

const defaultState: DashboardState = {
  dashboards: [{name: 'Default Dashboard', active: true}]
};

export interface DashboardState {
  dashboards: IDashboard[];
}

export function reducer(state: DashboardState = defaultState, action: DashboardActions.All): DashboardState {
  switch (action.type) {
    case DashboardActions.CREATE:
      return {
        dashboards: [
          ...state.dashboards.map((db) => { db.active = false; return db; }),
          { ...(<DashboardActions.Create> action).payload, active: true }
        ]
      };

    case DashboardActions.UPDATE:
      return state;

    case DashboardActions.REMOVE:
      return {
        dashboards: state.dashboards.filter(e => e !== (<DashboardActions.Remove> action).payload)
      };

    default:
      return state;
  }
}
