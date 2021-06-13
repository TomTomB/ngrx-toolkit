import { HttpHeaders } from '@angular/common/http';
import { EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, ActionCreator, ReducerTypes } from '@ngrx/store';
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
  queryParams?: Record<string | number, unknown>;
  params?: Record<string | number, unknown>;
  body?: unknown;
  sideUpdateArgs?: {
    success?: ArgumentsBase[];
    failure?: ArgumentsBase[];
  };
}

export const enum CallState {
  INIT = 'INIT',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface EntityStatus<Arguments = any, Response = any> {
  callState: CallState;
  action: TypedApiAction<Arguments, Response>;
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

export type CallCreator<T = any> = ActionCreator<
  string,
  (props: Args<T>) => Args<T> & TypedActionNative<string>
>;

export type SuccessCreator<T = any, J = any> = ActionCreator<
  string,
  (
    props: Response<J> & Args<T>
  ) => Response<J> & Args<T> & TypedActionNative<string>
>;

export type FailureCreator<T = any, J = any> = ActionCreator<
  string,
  (
    props: ErrorAction<J> & Args<T>
  ) => ErrorAction<J> & Args<T> & TypedActionNative<string>
>;

export interface TypedActionObject<
  Args extends ArgumentsBase | null = any,
  Response = any,
  Error = any
> {
  isUnique: boolean;

  call: CallCreator<Args>;
  success: SuccessCreator<Args, Response>;
  failure: FailureCreator<Args, Error>;
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

export interface StoreSlice {
  ons: ReducerTypes<any, any>[];
  adapters: { [typeId: string]: EntityAdapter<EntityStatus<any, any>> };
  initialState: { [typeId: string]: EntityState<EntityStatus<any, any>> };
}
