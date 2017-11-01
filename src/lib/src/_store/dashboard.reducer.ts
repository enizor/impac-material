import * as DashboardActions from './dashboard.actions';
import { Dashboard } from '../_models/dashboard.model';

export function reducer(state: Array<Dashboard>, action: DashboardActions.All): Array<Dashboard> {
  switch (action.type) {

    case DashboardActions.INIT:
      return [];

    case DashboardActions.INIT_SUCCESS:
      console.log('### DEBUG INIT_SUCCESS', (<DashboardActions.CreateSuccess>action).payload);
      return [...state, ...(<DashboardActions.InitSuccess>action).payload];

    case DashboardActions.INIT_ERROR:
      return state;

    case DashboardActions.CREATE:
      return state;

    case DashboardActions.CREATE_SUCCESS:
      console.log('### DEBUG CREATE_SUCCESS', (<DashboardActions.CreateSuccess>action).payload);
      return [
        ...state,
        (<DashboardActions.CreateSuccess>action).payload
      ];

    case DashboardActions.REMOVE:
      return state;

    case DashboardActions.REMOVE_SUCCESS:
      console.log('### DEBUG in REMOVE_SUCCESS', ((<DashboardActions.RemoveSuccess>action).payload));
      return state.filter(e => e !== (<DashboardActions.RemoveSuccess>action).payload);

    case DashboardActions.REMOVE_ERROR:
      return state;

    default:
      return state;
  }
}
