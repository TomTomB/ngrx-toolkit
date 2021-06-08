import { Action, createReducer } from '@ngrx/store';
import { createStoreSlice } from '../helpers';
import * as Actions from './sandbox.actions';

export const SANDBOX_FEATURE_KEY = 'sandbox';

export interface State {}

export interface SandboxPartialState {
  readonly [SANDBOX_FEATURE_KEY]: State;
}

export const storeSlice = createStoreSlice([Actions.postSandbox]);

const sandboxReducer = createReducer(
  storeSlice.initialState,
  ...storeSlice.ons
);

export function reducer(state: State | undefined, action: Action) {
  return sandboxReducer(state, action);
}
