import {
  defineArgTypes,
  createHttpActionGroup,
} from '../../../../ngrx-toolkit/src/public-api';
import * as Models from './sandbox.models';

export const SANDBOX_ACTION_PREFIX = 'Sandbox';

export const getFoo = createHttpActionGroup({
  method: 'GET',
  name: 'Foo',
  scope: SANDBOX_ACTION_PREFIX,
  argsTypes: defineArgTypes<{
    args: Models.GetFooArgs;
    response: Models.Sandbox;
    errorResponse: null;
  }>(),
});

export const getBar = createHttpActionGroup({
  method: 'GET',
  name: 'Bar',
  scope: SANDBOX_ACTION_PREFIX,
  argsTypes: defineArgTypes<{
    args: Models.GetBarArgs;
    response: { value: boolean };
    errorResponse: null;
  }>(),
});

export const postSandbox = createHttpActionGroup({
  method: 'POST',
  name: 'The Sandbox',
  scope: SANDBOX_ACTION_PREFIX,
  isUnique: true,
  argsTypes: defineArgTypes<{
    args: Models.PostSandboxArgs;
    response: Models.Sandbox;
    errorResponse: Models.PostSandboxError;
  }>(),
});

export const SANDBOX_ACTIONS = { postSandbox, getFoo, getBar };
