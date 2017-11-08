import * as DashboardActions from './dashboard.actions';
import { Dashboard } from '../_models/dashboard.model';

export function reducer(state: Array<Dashboard>, action: DashboardActions.All): Array<Dashboard> {
  switch (action.type) {

    case DashboardActions.INIT:
      return [];

    case DashboardActions.INIT_SUCCESS:
      const response = (<DashboardActions.InitSuccess>action).payload;
      return [
        Object.assign(new Dashboard(), response[0], { active: true }),
        ...response.slice(1, response.length)
      ];

    case DashboardActions.INIT_ERROR:
      return state;

    case DashboardActions.CREATE_SUCCESS:
      console.log('### DEBUG CREATE_SUCCESS', (<DashboardActions.CreateSuccess>action).payload);
      return [
        ...state,
        (<DashboardActions.CreateSuccess>action).payload
      ];

    case DashboardActions.CREATE_ERROR:
      console.log('### DEBUG CREATE_ERROR error', (<DashboardActions.CreateError>action).payload);
      return state;

    case DashboardActions.SELECT:
      let index = (<DashboardActions.Select>action).index;
      return state.map((item) => {
        if (item.id === index) { return Object.assign(new Dashboard(), item, { active: true }); }
        return Object.assign(new Dashboard(), item, { active: false });
      });

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
