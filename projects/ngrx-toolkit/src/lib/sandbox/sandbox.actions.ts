import { createActionGroup } from '../helpers';
import * as fromModels from './sandbox.models';

export const SANDBOX_PREFIX = 'Sandbox';

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

export const SANDBOX_ACTIONS = [postSandbox];
