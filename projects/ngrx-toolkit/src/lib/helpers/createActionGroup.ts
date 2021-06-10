import {
  Args,
  Response,
  ErrorAction,
  TypedActionObject,
  ArgumentsBase,
} from '../types';
import { createAction, props } from '@ngrx/store';

export const createActionGroup = <
  Arguments extends ArgumentsBase | null,
  ResponseData,
  ErrorResponse = unknown
>({
  method,
  scope,
  name,
  isUnique,
}: {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  scope: string;
  name: string;
  isUnique?: boolean;
}): TypedActionObject<Arguments, ResponseData, ErrorResponse> => {
  return {
    isUnique: !!isUnique,
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
