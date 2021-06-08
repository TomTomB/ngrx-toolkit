import { Args, Response, ErrorAction } from '../types';
import { createAction, props } from '@ngrx/store';

export const createActionGroup = <
  Arguments extends {
    queryParams?: Record<string | number, unknown>;
    params?: Record<string | number, unknown>;
    body?: unknown;
    id?: string;
  },
  ResponseData,
  ErrorResponse = unknown
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
