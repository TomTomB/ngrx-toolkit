import { Action, on } from '@ngrx/store';
import { createReducerSlice } from '../../../../ngrx-toolkit/src/public-api';
import * as Actions from './sandbox.actions';

export const SANDBOX_FEATURE_KEY = 'sandbox';

export interface SandboxPartialState {
  readonly [SANDBOX_FEATURE_KEY]: State;
}

export const { reducerSlice, reducerAdapters, initialState } =
  createReducerSlice(
    {
      actions: Actions.SANDBOX_ACTIONS,
      key: SANDBOX_FEATURE_KEY,
      initialStateExtra: {
        foo: 'dsas',
      },
    },
    on(Actions.getBar.call, (state, action) => {
      const entityId = Actions.getBar.entityId;

      // you can now do custom stuff with the underlying entity adapter
      const entityAdapter = reducerAdapters[entityId];

      console.log('I am a custom on function called by', action);
      return state;
    })
  );

export type State = typeof initialState;

export function reducer(state: State | undefined, action: Action) {
  return reducerSlice(state, action);
}
