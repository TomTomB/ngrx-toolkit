import {
  defineArgTypes,
  createActionGroup,
} from '../../../../ngrx-toolkit/src/public-api';
import * as fromModels from './sandbox.models';

export const SANDBOX_PREFIX = 'Sandbox';

export const getFoo = createActionGroup({
  method: 'GET',
  name: 'Foo',
  scope: SANDBOX_PREFIX,
  argsTypes:
    defineArgTypes<{
      args: fromModels.GetFooArgs;
      response: fromModels.Sandbox;
      errorResponse: null;
    }>(),
});

export const getBar = createActionGroup({
  method: 'GET',
  name: 'Bar',
  scope: SANDBOX_PREFIX,
  argsTypes:
    defineArgTypes<{
      args: fromModels.GetBarArgs;
      response: { value: boolean };
      errorResponse: null;
    }>(),
});

export const postSandbox = createActionGroup({
  method: 'POST',
  name: 'The Sandbox',
  scope: SANDBOX_PREFIX,
  isUnique: true,
  argsTypes:
    defineArgTypes<{
      args: fromModels.PostSandboxArgs;
      response: fromModels.Sandbox;
      errorResponse: fromModels.PostSandboxError;
    }>(),
});

export const SANDBOX_ACTIONS = [postSandbox, getFoo, getBar] as const;
