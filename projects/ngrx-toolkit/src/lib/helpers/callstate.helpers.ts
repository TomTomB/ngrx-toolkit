import {
  CallState,
  EntityStatus,
  StoreSlice,
  TypedAction,
  TypedActionObject,
  TypedApiAction,
} from '../types';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import {
  Action,
  ActionCreator,
  createAction,
  createSelector,
  MemoizedSelector,
  on,
  props,
  ReducerTypes,
} from '@ngrx/store';

import { hashCode } from './util';
import { uniformActionType } from './status.helpers';

export const UNIQUE = '[UNIQUE]';
export const HIDDEN = '[HIDDEN]';

export const isAction = <T extends ActionCreator>(
  actionToBe: T,
  action: Action
  // @ts-ignore
): action is ReturnType<T> => action.type === actionToBe.type;

export const generateEntityId = (opts: any) => {
  if (opts) {
    return hashCode(JSON.stringify(opts));
  }

  return hashCode('NO_ARG');
};

export const UNIQUE_ID = generateEntityId(UNIQUE);

const UNIQUE_LIST: string[] = [];

export const createActionId = (
  action: TypedApiAction<any, any>,
  isUnique?: boolean
) => {
  if (isUnique) {
    if (!UNIQUE_LIST.some((u) => u === uniformActionType(action.type))) {
      UNIQUE_LIST.push(uniformActionType(action.type));
    }

    return UNIQUE_ID;
  }

  if (UNIQUE_LIST.some((u) => u === action.type)) {
    return UNIQUE_ID;
  }

  const args = (action as any).args;
  if (args) {
    const copiedArgs = JSON.parse(JSON.stringify(args));
    if (copiedArgs?.body?.password) {
      copiedArgs.body.password = '[HIDDEN]';
    }

    if (copiedArgs?.body?.plainPassword) {
      copiedArgs.body.plainPassword = '[HIDDEN]';
    }

    return generateEntityId(copiedArgs);
  }

  return generateEntityId(null);
};

export const createStoreSlice = (actionObjects: TypedActionObject[]) => {
  const storeSlice: StoreSlice = { ons: [], adapters: {}, initialState: {} };

  for (const obj of actionObjects) {
    const adapterId = uniformActionType(obj.call.type);

    const adapter = createEntityAdapter<EntityStatus>({
      selectId: (model: EntityStatus) => createActionId(model.action),
    });

    storeSlice.adapters[adapterId] = adapter;

    storeSlice.initialState[adapterId] = adapter.getInitialState();

    storeSlice.ons.push(
      onActionCall<any>(adapter, obj.call, adapterId, CallState.LOADING)
    );
    storeSlice.ons.push(
      onActionCall<any>(adapter, obj.success, adapterId, CallState.SUCCESS)
    );
    storeSlice.ons.push(
      onActionCall<any>(adapter, obj.failure, adapterId, CallState.ERROR)
    );
  }

  return storeSlice;
};

const onActionCall = <T extends { [key: string]: EntityState<EntityStatus> }>(
  adapter: EntityAdapter<EntityStatus>,
  actionCreator: any,
  adapterId: string,
  callState: CallState
): ReducerTypes<T, any> => {
  return on(
    actionCreator,
    (state, action) =>
      ({
        ...state,
        [adapterId]: adapter.setOne(
          createCallState(action, callState),
          state[adapterId]
        ),
      } as any)
  );
};

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

export const removeCallState = createAction(
  '[Call State] Remove',
  props<{ adapterId: string; actionId: number }>()
);

export const onRemoveCallState = <
  T extends { [key: string]: EntityState<EntityStatus> }
>(
  storeSlice: StoreSlice
): ReducerTypes<T, any> => {
  return on(removeCallState, (state, { actionId, adapterId }) => {
    const adapter = storeSlice.adapters[adapterId];

    if (!adapter) {
      return state;
    }

    return {
      ...state,
      [adapterId]: adapter.removeOne(actionId, state[adapterId]),
    } as any;
  });
};

export const resetFeatureStore = createAction(
  '[Core] Reset Feature Store',
  props<{ featureName?: string }>()
);

export const onClearFeature = <T>(
  key: string,
  initialState: any
): ReducerTypes<T, any> => {
  return on(resetFeatureStore, (state, { featureName }) =>
    featureName === key || !featureName
      ? {
          ...initialState,
        }
      : state
  );
};

export const createEntitySelectors = ({
  getState,
  storeSlice,
}: {
  getState: MemoizedSelector<any, any>;
  storeSlice: StoreSlice;
}) => {
  const getAdapterEntities = (state: any, adapterId: string) => {
    const adapter = storeSlice.adapters[adapterId];

    const { selectEntities } = adapter.getSelectors();

    return selectEntities(state[adapterId]);
  };

  const getStoreSliceAdapterEntities = (adapterId: string) =>
    createSelector(getState, (s) => getAdapterEntities(s, adapterId));

  const getCallStateById = (adapterId: string, actionId: number) =>
    createSelector(
      getStoreSliceAdapterEntities(adapterId),
      (s) => s[actionId] || null
    );

  const getIsInit = (adapterId: string, actionId: number) =>
    createSelector(
      getCallStateById(adapterId, actionId),
      (s) => s?.callState === CallState.INIT ?? null
    );

  const getIsLoading = (adapterId: string, actionId: number) =>
    createSelector(
      getCallStateById(adapterId, actionId),
      (s) => s?.callState === CallState.LOADING ?? null
    );

  const getIsSuccess = (adapterId: string, actionId: number) =>
    createSelector(
      getCallStateById(adapterId, actionId),
      (s) => s?.callState === CallState.SUCCESS ?? null
    );

  const getIsError = (adapterId: string, actionId: number) =>
    createSelector(
      getCallStateById(adapterId, actionId),
      (s) => s?.callState === CallState.ERROR ?? null
    );

  const getTimestamp = (adapterId: string, actionId: number) =>
    createSelector(
      getCallStateById(adapterId, actionId),
      (s) => s?.timestamp ?? null
    );

  const getArgs = (adapterId: string, actionId: number) =>
    createSelector(
      getCallStateById(adapterId, actionId),
      (s) => s?.action.args ?? null
    );

  const getResponse = (adapterId: string, actionId: number) =>
    createSelector(
      getCallStateById(adapterId, actionId),
      (s) => s?.action.response ?? null
    );

  const getType = (adapterId: string, actionId: number) =>
    createSelector(
      getCallStateById(adapterId, actionId),
      (s) => s?.action.type ?? null
    );

  const getError = (adapterId: string, actionId: number) =>
    createSelector(
      getCallStateById(adapterId, actionId),
      (s) => s?.action.error ?? null
    );

  const getEntityId = (adapterId: string, actionId: number) =>
    createSelector(getCallStateById(adapterId, actionId), (s) =>
      s ? actionId : null
    );

  const getCallState = (adapterId: string, actionId: number) =>
    createSelector(getCallStateById(adapterId, actionId), (s) =>
      s ? s.callState : null
    );

  return {
    getCallStateById,
    getCallState,
    getIsInit,
    getIsLoading,
    getIsSuccess,
    getIsError,
    getTimestamp,
    getArgs,
    getResponse,
    getType,
    getError,
    getEntityId,
  };
};

export type EntitySelectors = ReturnType<typeof createEntitySelectors>;
