import * as DashboardActions from './dashboard.actions';
import { IDashboard } from '../_jsonapi-services/models/dashboard.model';

const defaultState: IDashboard[] = [{name: 'Default Dashboard', active: true}];

export function reducer(state: IDashboard[] = defaultState, action: DashboardActions.All): IDashboard[] {
  switch (action.type) {
    case DashboardActions.CREATE:
      return [...state.map((db) => { db.active = false; return db; }), { ...(<DashboardActions.Create> action).payload, active: true }];

    case DashboardActions.UPDATE:
      return state;

    case DashboardActions.REMOVE:
      return state.filter(e => e !== (<DashboardActions.Remove> action).payload);

    default:
      return state;
  }
}
