import { Action, on } from '@ngrx/store';
import { createReducerSlice } from '../../../../ngrx-toolkit/src/public-api';
import { actionMap } from './sandbox.actions';

export const SANDBOX_FEATURE_KEY = 'sandbox';

export type State = typeof initialState;

export interface SandboxPartialState {
  readonly [SANDBOX_FEATURE_KEY]: State;
}

export const { reducerSlice, reducerAdapters, initialState } =
  createReducerSlice(
    {
      actions: actionMap,
      key: SANDBOX_FEATURE_KEY,
      initialStateExtra: {
        foo: 'dsas',
      },
    },
    on(actionMap.getBar.call, (state, action) => {
      const entityId = actionMap.getBar.entityId;

      // you can now do custom stuff with the underlying entity adapter
      const entityAdapter = reducerAdapters[entityId];

      console.log('I am a custom on function called by', action);
      return state;
    })
  );

export function reducer(state: State | undefined, action: Action) {
  return reducerSlice(state, action);
}
