import * as DashboardActions from './dashboard.actions';
import * as DashboardReducer from './dashboard.reducer';

describe('The Dashboard Reducer', () => {
  let state: any;

  const createInitialState = () => {
    return [{name: 'Default Dashboard', active: true}];
  };

  beforeEach(() => {
    state = createInitialState();
  });

  it('returns the default state', () => {
    const result = DashboardReducer.reducer(undefined, {} as any);
    expect(result).toEqual(state);
  });

  it('adds a dashboard', () => {
    const action = new DashboardActions.Create({name: 'Accounting Dashboard'});
    const newState = DashboardReducer.reducer(state, action);
    expect(newState.length).toEqual(2);
  });

  it('deletes a dashboard', () => {
    const action = new DashboardActions.Remove(state[0]);
    const newState = DashboardReducer.reducer(state, action);
    expect(newState.length).toEqual(0);
  });
});
