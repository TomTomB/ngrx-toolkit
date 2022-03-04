import { HttpHeaders } from '@angular/common/http';
import { EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, ActionCreator } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';

export declare interface TypedActionNative<T extends string> extends Action {
  readonly type: T;
}
export interface Response<T> {
  response: T;
}

export interface ErrorAction<ErrorResponse> {
  error: ActionError<ErrorResponse>;
}

export interface Args<T> {
  args: T & { actionOptions?: ActionOptions };
}

export interface ActionOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  extras?: {
    skipCache?: boolean;
  };
}

export interface ArgumentsBase {
  queryParams?: Record<string | number | symbol, any>;
  params?: Record<string | number | symbol, any>;
  body?: unknown;
  sideUpdates?: Record<string, ArgumentsBase>;
}

export const enum CallState {
  INIT = 'INIT',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface EntityStatus<
  Arguments = any,
  Response = any,
  ErrorResponse = any
> {
  callState: CallState;
  action: TypedApiAction<Arguments, Response, ErrorResponse>;
  timestamp: number;
}

export interface TypedApiAction<Arguments, Response, ErrorResponse = any>
  extends TypedAction {
  args?: Arguments;
  response?: Response;
  error?: ActionError<ErrorResponse>;
}

export interface TypedAction extends Action {
  readonly type: string;
  [key: string]: any;
}

export type CallCreator<
  ArgType = any,
  ActionName extends string = string
> = ActionCreator<
  ActionName,
  (props: Args<ArgType>) => Args<ArgType> & TypedActionNative<ActionName>
>;

export type SuccessCreator<
  ArgType = any,
  ResponseData = any,
  ActionName extends string = string
> = ActionCreator<
  ActionName,
  (
    props: Response<ResponseData> & Args<ArgType>
  ) => Response<ResponseData> & Args<ArgType> & TypedActionNative<ActionName>
>;

export type FailureCreator<
  ArgType = any,
  ResponseData = any,
  ActionName extends string = string
> = ActionCreator<
  ActionName,
  (
    props: ErrorAction<ResponseData> & Args<ArgType>
  ) => ErrorAction<ResponseData> & Args<ArgType> & TypedActionNative<ActionName>
>;

export type ActionMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS'
  | 'CONNECT'
  | 'TRACE'
  | 'LOCAL';

export interface TypedActionObject<
  Args extends ArgumentsBase | undefined | null,
  Response,
  Error,
  Method extends ActionMethod,
  ActionName extends string
> {
  isUnique: boolean;
  entityId: ActionName;
  method: Method;

  call: CallCreator<Args, ActionName>;
  success: SuccessCreator<Args, Response, `${ActionName} Success`>;
  failure: FailureCreator<Args, Error, `${ActionName} Failure`>;
}

export type AnyTypedActionObject = TypedActionObject<any, any, any, any, any>;

export interface MappedEntityState<X extends AnyTypedActionObject> {
  response$: Observable<ReturnType<X['success']>['response'] | null>;
  cachedResponse$: Observable<ReturnType<X['success']>['response']>;

  error$: Observable<ReturnType<X['failure']>['error'] | null>;
  args$: Observable<ReturnType<X['call']>['args'] | null>;

  isInit$: Observable<boolean | null>;
  isLoading$: Observable<boolean | null>;
  isSuccess$: Observable<boolean | null>;
  isError$: Observable<boolean | null>;

  isPolling$: Observable<boolean>;

  timestamp$: Observable<number | null>;
  type$: Observable<string | null>;
  entityId$: Observable<number | null>;
  callState$: Observable<CallState | null>;

  refresh: () => void;
  remove: () => void;
  startPolling: (args: {
    intervalDuration: number;
    killSwitch: Subject<boolean>;
  }) => void;
  stopPolling: () => void;
}

export interface HttpCallOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  queryParams?: Record<string, string | number>;
  params?: Record<string, any>;
  responseType?: 'json' | 'arraybuffer';
  actionOptions?: ActionOptions;
}

export interface HttpGetOptions extends HttpCallOptions {}

export interface HttpPostOptions extends HttpCallOptions {
  body?: any;
}

export interface HttpPutOptions extends HttpCallOptions {
  body?: any;
}

export interface HttpPatchOptions extends HttpCallOptions {
  body?: any;
}

export interface HttpDeleteOptions extends HttpCallOptions {}

export interface ActionError<T = unknown> {
  status: number | string;
  message: string;
  data: T | null;
}

export interface FirebaseError {
  code: string;
  message: string;
}

export type ActionCallArgs<T extends AnyTypedActionObject> = ReturnType<
  T['call']
>['args'];
export type ActionSuccessResponse<T extends AnyTypedActionObject> = ReturnType<
  T['success']
>['response'];
export type ActionCallSideUpdates<T extends AnyTypedActionObject> = ReturnType<
  T['call']
>['args']['sideUpdates'];

export type ActionInitialState<
  Actions extends Record<string, AnyTypedActionObject>
> = {
  [Property in keyof Actions as Actions[Property]['call']['type']]: EntityState<
    EntityStatus<
      ReturnType<Actions[Property]['call']>['args'],
      ReturnType<Actions[Property]['success']>['response'],
      ReturnType<Actions[Property]['failure']>['error']
    >
  >;
};

export type EntityReducerMap<X extends Record<string, AnyTypedActionObject>> = {
  [Property in keyof X as X[Property]['call']['type']]: EntityAdapter<
    EntityStatus<
      ReturnType<X[Property]['call']>['args'],
      ReturnType<X[Property]['success']>['response'],
      ReturnType<X[Property]['failure']>['error']
    >
  >;
};

export type Dispatchers<T extends Record<string, AnyTypedActionObject>> = {
  [Property in keyof T]: (
    args: ActionCallArgs<T[Property]>
  ) => MappedEntityState<T[Property]>;
};

export interface ActionCreatorArgs {
  method?:
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'PATCH'
    | 'DELETE'
    | 'HEAD'
    | 'OPTIONS'
    | 'CONNECT'
    | 'TRACE';
  types: {
    args?: ArgumentsBase;
    response?: any;
    errorResponse?: any;
  };
  isUnique?: boolean;
}

export type ActionMap<
  Scope extends string,
  Actions extends Record<string, ActionCreatorArgs>
> = {
  [Property in keyof Actions as CastString<Property>]: TypedActionObject<
    Actions[Property]['types']['args'],
    Actions[Property]['types']['response'],
    Actions[Property]['types']['errorResponse'],
    Actions[Property]['method'] extends string
      ? Actions[Property]['method']
      : 'LOCAL',
    `[${Scope}] [${Actions[Property]['method'] extends string
      ? Actions[Property]['method']
      : 'LOCAL'}] ${CastString<Property>}`
  >;
};

type CastString<T> = T extends string ? T : never;
