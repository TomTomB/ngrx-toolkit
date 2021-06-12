import {
  Args,
  Response,
  ErrorAction,
  TypedActionObject,
  ArgumentsBase,
} from '../types';
import { createAction, props } from '@ngrx/store';
import { SideUpdates } from '../types/internal';

export const createActionGroup = <
  Arguments extends ArgumentsBase | null,
  ResponseData,
  ErrorResponse = unknown,
  SuccessSideUpdates extends readonly TypedActionObject[] = readonly TypedActionObject[],
  FailureSideUpdates extends readonly TypedActionObject[] = readonly TypedActionObject[]
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
    success?: readonly { action: SuccessSideUpdates[number]['success'] }[];
    failure?: readonly { action: FailureSideUpdates[number]['failure'] }[];
  };
}): TypedActionObject<
  Arguments & SideUpdates<SuccessSideUpdates, FailureSideUpdates>,
  ResponseData,
  ErrorResponse,
  SuccessSideUpdates,
  FailureSideUpdates
> => {
  return {
    isUnique: !!isUnique,
    call: createAction(
      `[${scope}] [${method}] ${name}`,
      props<
        Args<Arguments & SideUpdates<SuccessSideUpdates, FailureSideUpdates>>
      >()
    ),
    success: createAction(
      `[${scope}] [${method}] ${name} Success`,
      props<
        Response<ResponseData> &
          Args<Arguments & SideUpdates<SuccessSideUpdates, FailureSideUpdates>>
      >()
    ),
    failure: createAction(
      `[${scope}] [${method}] ${name} Failure`,
      props<
        ErrorAction<ErrorResponse> &
          Args<Arguments & SideUpdates<SuccessSideUpdates, FailureSideUpdates>>
      >()
    ),
    sideUpdates,
  };
};

export type ActionGroup = ReturnType<typeof createActionGroup>;
