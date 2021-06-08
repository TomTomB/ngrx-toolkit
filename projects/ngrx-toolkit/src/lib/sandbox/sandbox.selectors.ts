import { createFeatureSelector } from '@ngrx/store';
import { createEntitySelectors } from '../helpers';
import {
  SandboxPartialState,
  SANDBOX_FEATURE_KEY,
  State,
  storeSlice,
} from './sandbox.reducer';

export const getState =
  createFeatureSelector<SandboxPartialState, State>(SANDBOX_FEATURE_KEY);

export const entitySelectors = createEntitySelectors({
  getState,
  storeSlice,
});
