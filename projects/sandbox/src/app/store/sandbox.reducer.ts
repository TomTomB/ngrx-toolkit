import { Action } from '@ngrx/store';
import { createReducerSlide } from '../../../../ngrx-toolkit/src/public-api';
import * as Actions from './sandbox.actions';

export const SANDBOX_FEATURE_KEY = 'sandbox';

export interface State {}

export interface SandboxPartialState {
  readonly [SANDBOX_FEATURE_KEY]: State;
}

export const { reducerSlice, reducerAdapters } = createReducerSlide({
  actions: Actions.SANDBOX_ACTIONS,
  key: SANDBOX_FEATURE_KEY,
});

export function reducer(state: State | undefined, action: Action) {
  return reducerSlice(state, action);
}
