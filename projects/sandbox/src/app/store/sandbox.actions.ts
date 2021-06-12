import { createActionGroup } from '../../../../ngrx-toolkit/src/public-api';
import * as fromModels from './sandbox.models';

export const SANDBOX_PREFIX = 'Sandbox';

export const getFoo = createActionGroup<
  fromModels.GetFooArgs,
  fromModels.Sandbox
>({
  method: 'GET',
  name: 'Foo',
  scope: SANDBOX_PREFIX,
});

export const getBar = createActionGroup<
  fromModels.GetBarArgs,
  fromModels.Sandbox
>({
  method: 'GET',
  name: 'Bar',
  scope: SANDBOX_PREFIX,
});

export const postSandbox = createActionGroup<
  fromModels.PostSandboxArgs,
  fromModels.Sandbox,
  fromModels.PostSandboxError,
  [typeof getFoo, typeof getBar],
  [typeof getFoo]
>({
  method: 'POST',
  name: 'The Sandbox',
  scope: SANDBOX_PREFIX,
  isUnique: true,
  sideUpdates: {
    success: [{ action: getFoo.success }, { action: getBar.success }] as const,
    failure: [{ action: getFoo.failure }] as const,
  },
});

export const SANDBOX_ACTIONS = [postSandbox, getFoo, getBar] as const;
