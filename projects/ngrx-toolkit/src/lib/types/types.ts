import { HttpHeaders } from '@angular/common/http';
import { EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, ActionCreator } from '@ngrx/store';
import { Observable } from 'rxjs';

export declare interface TypedActionNative<T extends string> extends Action {
  readonly type: T;
}
export interface Response<T> {
  response: T;
}

export interface ErrorAction<ErrorResponse> {
  error: Error<ErrorResponse>;
}

export interface Args<T> {
  args: T;
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
  error?: Error<ErrorResponse>;
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

export interface TypedActionObject<
  Args extends ArgumentsBase | null = any,
  Response = any,
  Error = any,
  ActionName extends string = string
> {
  isUnique: boolean;
  entityId: ActionName;

  call: CallCreator<Args, ActionName>;
  success: SuccessCreator<Args, Response, `${ActionName} Success`>;
  failure: FailureCreator<Args, Error, `${ActionName} Failure`>;
}

export interface MappedEntityState<X extends TypedActionObject> {
  response$: Observable<ReturnType<X['success']>['response'] | null>;
  truthyResponse$: Observable<ReturnType<X['success']>['response']>;
  falsyResponse$: Observable<null>;

  error$: Observable<ReturnType<X['failure']>['error'] | null>;
  args$: Observable<ReturnType<X['call']>['args'] | null>;

  isInit$: Observable<boolean | null>;
  isLoading$: Observable<boolean | null>;
  isSuccess$: Observable<boolean | null>;
  isError$: Observable<boolean | null>;

  timestamp$: Observable<number | null>;
  type$: Observable<string | null>;
  entityId$: Observable<number | null>;
  callState$: Observable<CallState | null>;
}

export interface HttpCallOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  queryParams?: Record<string, string | number>;
  params?: Record<string, any>;
  responseType?: 'json' | 'arraybuffer';
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

export interface Error<T = unknown> {
  status: number | string;
  message: string;
  data: T | null;
}

export interface FirebaseError {
  code: string;
  message: string;
}

export interface EntityActionState {
  [key: string]: EntityState<EntityStatus<any, any>>;
}

export type ActionCallArgs<T extends TypedActionObject> = ReturnType<
  T['call']
>['args'];
export type ActionSuccessResponse<T extends TypedActionObject> = ReturnType<
  T['success']
>['response'];
export type ActionCallSideUpdates<T extends TypedActionObject> = ReturnType<
  T['call']
>['args']['sideUpdates'];

export type EntityReducerMap = Record<
  string,
  EntityAdapter<EntityStatus<any, any>>
>;

export type ActionInitialState<X extends Record<string, TypedActionObject>> = {
  [Property in keyof X as X[Property]['call']['type']]: EntityState<
    EntityStatus<
      ReturnType<X[Property]['call']>['args'],
      ReturnType<X[Property]['success']>['response'],
      ReturnType<X[Property]['failure']>['error']
    >
  >;
};
