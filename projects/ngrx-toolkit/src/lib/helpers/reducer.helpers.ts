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
import { HIDDEN } from './constants';
import { uniformActionType } from './status.helpers';
import { createActionId } from './util';

export const createCallState = (
  action: TypedAction,
  type: CallState
): EntityStatus => {
  const newObj: EntityStatus = {
    action: {
      ...action,
      type: uniformActionType(action.type),
    },
    callState: type,
    timestamp: new Date().getTime(),
  };

  const anyAction = JSON.parse(JSON.stringify(newObj.action));

  if (anyAction.args?.body?.password) {
    anyAction.args.body.password = HIDDEN;
  }

  if (anyAction.args?.body?.plainPassword) {
    anyAction.args.body.plainPassword = HIDDEN;
  }

  newObj.action = anyAction;

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
  Key extends string,
  InitialStateExtra extends Record<any, any>
>(
  {
    actions,
    key,
    initialStateExtra,
  }: {
    actions: Actions;
    key: Key;
    initialStateExtra: InitialStateExtra;
  },
  ...additionalOns: ReducerTypes<
    ActionInitialState<Actions> & InitialStateExtra,
    ActionCreator[]
  >[]
) => {
  const initialState: ActionInitialState<Actions> & InitialStateExtra =
    JSON.parse(JSON.stringify(initialStateExtra));

  const ons: ReducerTypes<
    any,
    CallCreator[] | SuccessCreator[] | FailureCreator[]
  >[] = [];
  const adapters: EntityReducerMap<Actions> = {} as any;

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
    (initialState as any)[action.entityId] = adapterInitialState;

    (adapters as any)[action.entityId] = entityAdapter;

    ons.push(createOn(entityAdapter, action.call, entityId, CallState.LOADING));
    ons.push(
      createOn(entityAdapter, action.success, entityId, CallState.SUCCESS)
    );
    ons.push(
      createOn(entityAdapter, action.failure, entityId, CallState.ERROR)
    );
  }

  const reducerSlice = createReducer(
    initialState,
    ...ons,
    ...(additionalOns ? additionalOns : []),
    on(resetFeatureStore, (state, { featureName }) =>
      featureName === key || !featureName
        ? {
            ...initialState,
          }
        : state
    ),
    on(removeCallState, (state, { actionId, adapterId }) => {
      const adapter = (adapters as any)[adapterId];

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
    initialState,
  };
};
