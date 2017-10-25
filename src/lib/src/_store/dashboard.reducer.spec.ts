import * as DashboardActions from './dashboard.actions';
import * as DashboardReducer from './dashboard.reducer';

describe('The Dashboard Reducer', () => {
  const createInitialState = (props = {}) => {
    const initState = {
      dashboards: [{name: 'Default Dashboard', active: true}]
    };
    return Object.assign({}, initState, props);
  };

  it('returns the default state', () => {
    const state = createInitialState();
    const result = DashboardReducer.reducer(undefined, {} as any);
    expect(result).toEqual(state);
  });

  it('adds a dashboard', () => {
    const state = createInitialState();
    const action = new DashboardActions.Create({name: 'Accounting Dashboard'});
    const newState = DashboardReducer.reducer(state, action);
    expect(newState.dashboards.length).toEqual(2);
  });

  it('deletes a dashboard', () => {
    const state = createInitialState();
    const action = new DashboardActions.Remove(state.dashboards[0]);
    const newState = DashboardReducer.reducer(state, action);
    expect(newState.dashboards.length).toEqual(0);
  });
});
