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

export const postSandbox = createActionGroup<
  fromModels.PostSandboxArgs,
  fromModels.Sandbox,
  fromModels.PostSandboxError
>({
  method: 'POST',
  name: 'The Sandbox',
  scope: SANDBOX_PREFIX,
  isUnique: true,
});

export const SANDBOX_ACTIONS = [postSandbox, getFoo];
