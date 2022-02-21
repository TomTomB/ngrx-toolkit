import {
  Args,
  Response,
  ErrorAction,
  TypedActionObject,
  ArgumentsBase,
  ActionCreatorArgs,
  ActionMap,
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
  Method extends
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'PATCH'
    | 'DELETE'
    | 'HEAD'
    | 'OPTIONS'
    | 'CONNECT'
    | 'TRACE'
    | 'LOCAL',
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
  Method,
  `[${Scope}] [${Method}] ${Name}`
> => {
  const baseName: `[${Scope}] [${Method}] ${Name}` = `[${scope}] [${method}] ${name}`;

  return {
    method,
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

export const createActionMap = <
  Scope extends string,
  Actions extends Record<string, ActionCreatorArgs>
>(
  scope: Scope,
  actions: Actions
) => {
  const actionMap = {} as ActionMap<Scope, Actions>;

  Object.keys(actions).forEach((actionName: keyof Actions) => {
    const action = actions[actionName];

    const group = createActionGroup({
      scope,
      method: action.method ?? 'LOCAL',
      name: actionName as string,
      argsTypes: action.types,
      isUnique: !!action.isUnique,
    });

    // @ts-ignore
    actionMap[actionName] = group;
  });

  return actionMap;
};

export const resetFeatureStore = createAction(
  '[NgRx Toolkit] Reset Feature Store',
  props<{ featureName?: string }>()
);

export const removeCallState = createAction(
  '[NgRx Toolkit] Remove Call State',
  props<{ adapterId: string; actionId: number }>()
);
