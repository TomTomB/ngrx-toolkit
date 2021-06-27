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
  const getAdapterEntities = (state: any, adapterId: string) => {
    const adapter = reducerAdapters[adapterId];

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
