import { Action } from '@ngrx/store';
import { IDashboard } from '../_jsonapi-services/models/dashboard.model';

export const CREATE = '[DASHBOARD] Create';
export const CREATE_SUCCESS = '[DASHBOARD] Create success';
export const CREATE_ERROR = '[DASHBOARD] Create error';
export const UPDATE = '[DASHBOARD] Update';
export const REMOVE = '[DASHBOARD] Remove';

export class Create implements Action {
  readonly type = CREATE;

  constructor(public payload: IDashboard) {}
}

export class CreateSuccess implements Action {
  readonly type = CREATE_SUCCESS;

  constructor(public payload: IDashboard) {}
}

export class CreateError implements Action {
  readonly type = CREATE_ERROR;

  constructor(public payload: any) {}
}

export class Update implements Action {
  readonly type = UPDATE;
}

export class Remove implements Action {
  readonly type = REMOVE;

  constructor(public payload: IDashboard) {}
}

export type All
  = Create
  | CreateSuccess
  | CreateError
  | Update
  | Remove;
