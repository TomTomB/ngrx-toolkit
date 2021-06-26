import { Action } from '@ngrx/store';
import { CallState } from '../types';
import { createCallState } from './reducer.helpers';
import { uniformActionType } from './status.helpers';
import { createActionId } from './util';

export const createTestingState = ({
  action,
  reducer,
  initialState,
  callState,
}: {
  action: Action;
  reducer: (state: any, action: Action) => any;
  initialState: any;
  callState: CallState;
}) => {
  const actionId = createActionId(action);
  const actionKey = uniformActionType(action.type);
  const state = reducer(initialState, action);
  const cs = createCallState(action, callState);

  state[actionKey].entities[actionId].timestamp = cs.timestamp;

  const expectedState = {
    ...initialState,
    [actionKey]: { ids: [actionId], entities: { [actionId]: callState } },
  };

  return { state, expectedState };
};
