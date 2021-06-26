import {
  Args,
  Response,
  ErrorAction,
  TypedActionObject,
  ArgumentsBase,
} from '../types';
import { createAction, props } from '@ngrx/store';

export const defineArgTypes = <
  T extends {
    args?: ArgumentsBase | null;
    response?: any;
    errorResponse?: any;
  }
>() => null as any as T;

export const createActionGroup = <
  Scope extends string,
  Name extends string,
  ArgTypes extends ReturnType<typeof defineArgTypes> = ReturnType<
    typeof defineArgTypes
  >,
  Arguments = ArgTypes['args'],
  ResponseData = ArgTypes['response'],
  ErrorResponse = ArgTypes['errorResponse']
>({
  scope,
  name,
  isUnique,
}: {
  scope: Scope;
  name: Name;
  isUnique?: boolean;
  argsTypes: ArgTypes;
}): TypedActionObject<
  Arguments,
  ResponseData,
  ErrorResponse,
  `[${Scope}] ${Name}`
> => {
  const baseName: `[${Scope}] ${Name}` = `[${scope}] ${name}`;

  return {
    isUnique: !!isUnique,
    entityId: baseName,
    call: createAction(baseName, props<Args<Arguments>>()),
    success: createAction(
      `${baseName} Success`,
      props<Response<ResponseData> & Args<Arguments>>()
    ),
    failure: createAction(
      `${baseName} Failure`,
      props<ErrorAction<ErrorResponse> & Args<Arguments>>()
    ),
  };
};

export const createHttpActionGroup = <
  Method extends
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'PATCH'
    | 'DELETE'
    | 'HEAD'
    | 'OPTIONS'
    | 'CONNECT'
    | 'TRACE',
  Scope extends string,
  Name extends string,
  ArgTypes extends ReturnType<typeof defineArgTypes> = ReturnType<
    typeof defineArgTypes
  >,
  Arguments = ArgTypes['args'],
  ResponseData = ArgTypes['response'],
  ErrorResponse = ArgTypes['errorResponse']
>({
  method,
  scope,
  name,
  isUnique,
}: {
  method: Method;
  scope: Scope;
  name: Name;
  isUnique?: boolean;
  argsTypes: ArgTypes;
}): TypedActionObject<
  Arguments,
  ResponseData,
  ErrorResponse,
  `[${Scope}] [${Method}] ${Name}`
> => {
  const baseName: `[${Scope}] [${Method}] ${Name}` = `[${scope}] [${method}] ${name}`;

  return {
    isUnique: !!isUnique,
    entityId: baseName,
    call: createAction(baseName, props<Args<Arguments>>()),
    success: createAction(
      `${baseName} Success`,
      props<Response<ResponseData> & Args<Arguments>>()
    ),
    failure: createAction(
      `${baseName} Failure`,
      props<ErrorAction<ErrorResponse> & Args<Arguments>>()
    ),
  };
};

export const resetFeatureStore = createAction(
  '[NgRx Toolkit] Reset Feature Store',
  props<{ featureName?: string }>()
);

export const removeCallState = createAction(
  '[NgRx Toolkit] Remove Call State',
  props<{ adapterId: string; actionId: number }>()
);
