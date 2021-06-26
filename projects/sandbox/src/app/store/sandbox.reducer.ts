import { Action, on } from '@ngrx/store';
import {
  createReducerSlice,
  uniformActionType,
} from '../../../../ngrx-toolkit/src/public-api';
import * as Actions from './sandbox.actions';

export const SANDBOX_FEATURE_KEY = 'sandbox';

export interface SandboxPartialState {
  readonly [SANDBOX_FEATURE_KEY]: State;
}

export const { reducerSlice, reducerAdapters, innerInitialState } =
  createReducerSlice(
    {
      actions: Actions.SANDBOX_ACTIONS,
      key: SANDBOX_FEATURE_KEY,
      initialState: {
        booo: 'asdas',
      },
    },
    on(Actions.getBar.call, (state, action) => {
      const entityId = uniformActionType(action.type);

      // you can now do custom stuff with the underlying entity adapter
      const entityAdapter = reducerAdapters[entityId];

      console.log('I am a custom on function called by', action);
      return state;
    })
  );

export type State = typeof innerInitialState;

export function reducer(state: State | undefined, action: Action) {
  return reducerSlice(state, action);
}
