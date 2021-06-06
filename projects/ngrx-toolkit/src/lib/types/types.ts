import { HttpHeaders } from '@angular/common/http';
import { Action, ActionCreator } from '@ngrx/store';
import { Observable } from 'rxjs';

export declare interface TypedActionNative<T extends string> extends Action {
  readonly type: T;
}
export interface Response<T> {
  response: T;
}

export interface Paginated<T> {
  totalHits: number;
  currentPage: number;
  totalPageCount: number;
  itemsPerPage: number;
  items: T[];
}

export interface ErrorAction {
  error: Error;
}

export interface Violation {
  invalidValue: string | null;
  message: string;
  propertyPath: string | null;
}

export interface Args<T> {
  args: T;
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

export interface TypedApiAction<Arguments, Response> extends TypedAction {
  args?: Arguments;
  response?: Response;
  error?: Error;
}

export interface TypedAction extends Action {
  readonly type: string;
  [key: string]: any;
}

export interface TypedActionObject {
  call: ActionCreator<
    string,
    (props: Args<any>) => Args<any> & TypedActionNative<string>
  >;
  success: ActionCreator<
    string,
    (
      props: Response<any> & Args<any>
    ) => Response<any> & Args<any> & TypedActionNative<string>
  >;
  failure: ActionCreator<
    string,
    (
      props: ErrorAction & Args<any>
    ) => ErrorAction & Args<any> & TypedActionNative<string>
  >;
}

export interface MappedEntityState<X extends TypedActionObject> {
  response$: Observable<ReturnType<X['success']>['response'] | null>;
  truthyResponse$: Observable<ReturnType<X['success']>['response']>;
  falsyResponse$: Observable<null>;

  error$: Observable<Error | null>;
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

export interface Error {
  status: number;
  message: string;
  violations: Violation[];
}
