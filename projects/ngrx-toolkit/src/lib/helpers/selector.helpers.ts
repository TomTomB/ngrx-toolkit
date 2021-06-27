import { createSelector, MemoizedSelector } from '@ngrx/store';
import { CallState, EntityReducerMap } from '../types';

export const createEntitySelectors = <
  GetState extends MemoizedSelector<any, any>,
  Reducers extends EntityReducerMap<any>
>({
  getState,
  reducerAdapters,
}: {
  getState: GetState;
  reducerAdapters: Reducers;
}) => {
  const getAdapterEntities = (state: any, adapterId: keyof Reducers) => {
    const adapter = reducerAdapters[adapterId];

    const { selectEntities } = adapter.getSelectors();

    return selectEntities(state[adapterId]);
  };

  const getStoreSliceAdapterEntities = (adapterId: keyof Reducers) =>
    createSelector(getState, (s) => getAdapterEntities(s, adapterId));

  const getCallStateById = (adapterId: keyof Reducers, actionId: number) =>
    createSelector(
      getStoreSliceAdapterEntities(adapterId),
      (s) => s[actionId] || null
    );

  const getIsInit = (adapterId: keyof Reducers, actionId: number) =>
    createSelector(
      getCallStateById(adapterId, actionId),
      (s) => s?.callState === CallState.INIT ?? null
    );

  const getIsLoading = (adapterId: keyof Reducers, actionId: number) =>
    createSelector(
      getCallStateById(adapterId, actionId),
      (s) => s?.callState === CallState.LOADING ?? null
    );

  const getIsSuccess = (adapterId: keyof Reducers, actionId: number) =>
    createSelector(
      getCallStateById(adapterId, actionId),
      (s) => s?.callState === CallState.SUCCESS ?? null
    );

  const getIsError = (adapterId: keyof Reducers, actionId: number) =>
    createSelector(
      getCallStateById(adapterId, actionId),
      (s) => s?.callState === CallState.ERROR ?? null
    );

  const getTimestamp = (adapterId: keyof Reducers, actionId: number) =>
    createSelector(
      getCallStateById(adapterId, actionId),
      (s) => s?.timestamp ?? null
    );

  const getArgs = (adapterId: keyof Reducers, actionId: number) =>
    createSelector(
      getCallStateById(adapterId, actionId),
      (s) => s?.action.args ?? null
    );

  const getResponse = (adapterId: keyof Reducers, actionId: number) =>
    createSelector(
      getCallStateById(adapterId, actionId),
      (s) => s?.action.response ?? null
    );

  const getType = (adapterId: keyof Reducers, actionId: number) =>
    createSelector(
      getCallStateById(adapterId, actionId),
      (s) => s?.action.type ?? null
    );

  const getError = (adapterId: keyof Reducers, actionId: number) =>
    createSelector(
      getCallStateById(adapterId, actionId),
      (s) => s?.action.error ?? null
    );

  const getEntityId = (adapterId: keyof Reducers, actionId: number) =>
    createSelector(getCallStateById(adapterId, actionId), (s) =>
      s ? actionId : null
    );

  const getCallState = (adapterId: keyof Reducers, actionId: number) =>
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
