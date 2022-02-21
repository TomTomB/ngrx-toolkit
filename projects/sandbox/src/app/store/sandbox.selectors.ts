import { createFeatureSelector } from '@ngrx/store';
import { createEntitySelectors } from '../../../../ngrx-toolkit/src/public-api';
import * as fromReducer from './sandbox.reducer';

export const getState = createFeatureSelector<
  fromReducer.State
>(fromReducer.SANDBOX_FEATURE_KEY);

export const entitySelectors = createEntitySelectors({
  getState,
  reducerAdapters: fromReducer.reducerAdapters,
});
