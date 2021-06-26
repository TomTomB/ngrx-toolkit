import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { ActionCreator, createReducer, on, ReducerTypes } from '@ngrx/store';
import {
  ActionCallArgs,
  ActionInitialState,
  ActionSuccessResponse,
  CallCreator,
  CallState,
  EntityReducerMap,
  EntityStatus,
  FailureCreator,
  SuccessCreator,
  TypedAction,
  TypedActionObject,
} from '../types';
import { removeCallState, resetFeatureStore } from './action.helpers';
import { uniformActionType } from './status.helpers';
import { createActionId } from './util';

export const createCallState = (
  action: TypedAction,
  type: CallState
): EntityStatus => {
  const newObj = {
    action: {
      ...JSON.parse(JSON.stringify(action)),
      type: uniformActionType(action.type),
    },
    callState: type,
    timestamp: new Date().getTime(),
  };

  if (newObj.action.args?.body?.password) {
    newObj.action.args.body.password = '[HIDDEN]';
  }

  if (newObj.action.args?.body?.plainPassword) {
    newObj.action.args.body.plainPassword = '[HIDDEN]';
  }

  return newObj;
};

export const createOn = <
  Adapter extends EntityAdapter<EntityStatus>,
  Action extends CallCreator | SuccessCreator | FailureCreator,
  AdapterId extends string,
  CallStateType extends CallState
>(
  adapter: Adapter,
  actionCreator: Action,
  adapterId: AdapterId,
  callState: CallStateType
) => {
  return on<Record<string, EntityState<EntityStatus<any, any>>>, Action[]>(
    actionCreator,
    (state, action) => ({
      ...state,
      [adapterId]: adapter.setOne(
        createCallState(action, callState),
        state[adapterId]
      ),
    })
  );
};

export const createReducerSlice = <
  Actions extends Record<string, TypedActionObject>,
  InitialState extends Record<string, any>,
  Key extends string
>(
  {
    actions,
    key,
    initialState,
  }: {
    actions: Actions;
    key: Key;
    initialState?: InitialState;
  },
  ...additionalOns: ReducerTypes<
    ActionInitialState<Actions> & InitialState,
    ActionCreator[]
  >[]
) => {
  const innerInitialState: ActionInitialState<Actions> & InitialState =
    initialState ? JSON.parse(JSON.stringify(initialState)) : {};

  const ons: ReducerTypes<
    any,
    CallCreator[] | SuccessCreator[] | FailureCreator[]
  >[] = [];
  const adapters: EntityReducerMap = {};

  for (const action of Object.values(actions)) {
    const entityId = action.entityId;

    const entityAdapter = createEntityAdapter<
      EntityStatus<
        ActionCallArgs<typeof action>,
        ActionSuccessResponse<typeof action>
      >
    >({
      selectId: (
        model: EntityStatus<
          ActionCallArgs<typeof action>,
          ActionSuccessResponse<typeof action>
        >
      ) => createActionId(model.action),
    });

    const adapterInitialState = entityAdapter.getInitialState();
    (innerInitialState as any)[action.entityId] = adapterInitialState;

    adapters[action.entityId] = entityAdapter;

    ons.push(createOn(entityAdapter, action.call, entityId, CallState.LOADING));
    ons.push(
      createOn(entityAdapter, action.success, entityId, CallState.SUCCESS)
    );
    ons.push(
      createOn(entityAdapter, action.failure, entityId, CallState.ERROR)
    );
  }

  const reducerSlice = createReducer(
    innerInitialState,
    ...ons,
    ...(additionalOns ? additionalOns : []),
    on(resetFeatureStore, (state, { featureName }) =>
      featureName === key || !featureName
        ? {
            ...innerInitialState,
          }
        : state
    ),
    on(removeCallState, (state, { actionId, adapterId }) => {
      const adapter = adapters[adapterId];

      if (!adapter) {
        return state;
      }

      return {
        ...state,
        [adapterId]: adapter.removeOne(actionId, state[adapterId]),
      };
    })
  );

  return {
    reducerSlice,
    reducerAdapters: adapters,
    innerInitialState,
  };
};
