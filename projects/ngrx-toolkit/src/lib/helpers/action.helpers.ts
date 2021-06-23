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
  } = { args?: ArgumentsBase | null; response?: any; errorResponse?: any }
>() => null as any as T;

export const createActionGroup = <
  Method extends 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  Scope extends string,
  Name extends string,
  ArgTypes extends ReturnType<typeof defineArgTypes> = ReturnType<
    typeof defineArgTypes
  >,
  Arguments = ArgTypes['args'] | null,
  ResponseData = ArgTypes['response'] | null,
  ErrorResponse = ArgTypes['errorResponse'] | null
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

export const resetFeatureStore = createAction(
  '[NgRx Toolkit] Reset Feature Store',
  props<{ featureName?: string }>()
);

export const removeCallState = createAction(
  '[NgRx Toolkit] Remove Call State',
  props<{ adapterId: string; actionId: number }>()
);
