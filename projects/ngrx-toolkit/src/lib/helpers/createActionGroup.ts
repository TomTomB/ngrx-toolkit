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
  ErrorResponse = unknown,
  SuccessSideUpdates extends TypedActionObject[] = TypedActionObject[],
  FailureSideUpdates extends TypedActionObject[] = TypedActionObject[]
>({
  method,
  scope,
  name,
  isUnique,
  sideUpdates,
}: {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  scope: string;
  name: string;
  isUnique?: boolean;
  sideUpdates?: {
    success?: { action: SuccessSideUpdates[number]['success'] }[];
    failure?: { action: FailureSideUpdates[number]['failure'] }[];
  };
}) => {
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
    sideUpdates,
  };
};

export type ActionGroup = ReturnType<typeof createActionGroup>;
