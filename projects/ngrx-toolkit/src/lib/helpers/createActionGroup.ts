import { Args, Response, ErrorAction } from '../types';
import { createAction, props } from '@ngrx/store';

export const createActionGroup = <
  Arguments,
  ResponseData,
  ErrorResponse = any
>({
  method,
  scope,
  name,
}: {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  scope: string;
  name: string;
}) => {
  return {
    call: createAction(
      `[${scope}] [${method}] ${name}`,
      props<Args<Arguments>>()
    ),
    success: createAction(
      `[${scope}] [${method}] ${name} Success`,
      props<Response<ResponseData> & Args<Arguments>>()
    ),
    failure: createAction(
      `[${scope}] [${method}] ${name} Failure`,
      props<ErrorAction<ErrorResponse> & Args<Arguments>>()
    ),
  };
};

export type ActionGroup = ReturnType<typeof createActionGroup>;
