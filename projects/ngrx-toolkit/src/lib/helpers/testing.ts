import { Action } from '@ngrx/store';
import { CallState } from '../types';
import { createCallState } from './reducer.helpers';
import { uniformActionType } from './status.helpers';
import { createActionId } from './util';

export const createTestingState = <
  ActionToCall extends Action,
  ReducerFn extends (a: any, b: any) => any,
  InitialState,
  CS extends CallState
>({
  action,
  reducer,
  initialState,
  callState,
}: {
  action: ActionToCall;
  reducer: ReducerFn;
  initialState: InitialState;
  callState: CS;
}) => {
  const actionId = createActionId(action);
  const actionKey = uniformActionType(action.type);
  const state = reducer(initialState, action);
  const callStateEntity = createCallState(action, callState);

  state[actionKey].entities[actionId].timestamp = callStateEntity.timestamp;

  const expectedState = {
    ...initialState,
    [actionKey]: { ids: [actionId], entities: { [actionId]: callStateEntity } },
  };

  return { state, expectedState };
};
