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
  { value: boolean }
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
    success: [
      { action: getFoo.success },
      { action: getBar.success, mapFn: (x) => ({ value: !!x }) },
    ],
    failure: [{ action: getFoo.failure }],
  },
});

export const SANDBOX_ACTIONS = [postSandbox, getFoo, getBar] as const;
