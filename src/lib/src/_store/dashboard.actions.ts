import { Action } from '@ngrx/store';
import { Dashboard } from '../_models/dashboard.model';

export const INIT = '[DASHBOARD] Init';
export const INIT_SUCCESS = '[DASHBOARD] Init success';
export const INIT_ERROR = '[DASHBOARD] Init error';
export const CREATE = '[DASHBOARD] Create';
export const CREATE_SUCCESS = '[DASHBOARD] Create success';
export const CREATE_ERROR = '[DASHBOARD] Create error';
export const REMOVE = '[DASHBOARD] Remove';
export const REMOVE_SUCCESS = '[DASHBOARD] Remove success';
export const REMOVE_ERROR = '[DASHBOARD] Remove error';

export class Init implements Action {
  readonly type = INIT;
}

export class InitSuccess implements Action {
  readonly type = INIT_SUCCESS;

  constructor(public payload: Array<Dashboard>) {}
}

export class InitError implements Action {
  readonly type = INIT_ERROR;
}

export class Create implements Action {
  readonly type = CREATE;

  constructor(public payload: Dashboard) {}
}

export class CreateSuccess implements Action {
  readonly type = CREATE_SUCCESS;

  constructor(public payload: Dashboard) {}
}

export class CreateError implements Action {
  readonly type = CREATE_ERROR;

  constructor(public payload: any) {}
}

export class Remove implements Action {
  readonly type = REMOVE;

  constructor(public payload: Dashboard) {}
}

export class RemoveSuccess implements Action {
  readonly type = REMOVE_SUCCESS;

  constructor(public payload: Dashboard) {}
}

export class RemoveError implements Action {
  readonly type = REMOVE_ERROR;

  constructor(public payload: any) {}
}

export type All
  = Init
  | InitSuccess
  | InitError
  | Create
  | CreateSuccess
  | CreateError
  | Remove
  | RemoveSuccess
  | RemoveError;
