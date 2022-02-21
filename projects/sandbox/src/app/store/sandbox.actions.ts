import {
  defineArgTypes,
  createActionMap,
} from '../../../../ngrx-toolkit/src/public-api';
import * as Models from './sandbox.models';

export const actionMap = createActionMap('Sandbox', {
  getFoo: {
    method: 'GET',
    types: defineArgTypes<{
      args: Models.GetFooArgs;
      response: Models.Sandbox;
    }>(),
  },
  getBar: {
    method: 'GET',
    types: defineArgTypes<{
      args: Models.GetBarArgs;
      response: { value: boolean };
    }>(),
  },
  postSandbox: {
    method: 'POST',
    isUnique: true,
    types: defineArgTypes<{
      args: Models.PostSandboxArgs;
      response: Models.Sandbox;
      errorResponse: Models.PostSandboxError;
    }>(),
  },
  benchmark: {
    types: defineArgTypes<{
      args: Models.BenchmarkArgs;
      response: { value: boolean };
    }>(),
  },
});
