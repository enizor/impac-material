import { Action } from '@ngrx/store';
import { Dashboard } from '../_model/dashboard.model';

export const CREATE = '[DASHBOARD] Create';
export const UPDATE = '[DASHBOARD] Update';
export const REMOVE = '[DASHBOARD] Remove';

export class Create implements Action {
  readonly type = CREATE;

  constructor(public payload: Dashboard) {}
}

export class Update implements Action {
  readonly type = UPDATE;
}

export class Remove implements Action {
  readonly type = REMOVE;

  constructor(public payload: Dashboard) {}
}

export type All
  = Create
  | Update
  | Remove;
