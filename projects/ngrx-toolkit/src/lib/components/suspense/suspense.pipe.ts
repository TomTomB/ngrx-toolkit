import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MappedEntityState, TypedActionObject } from '../../types';

type Extract<P> = P extends Observable<infer T> ? T : never;

interface State<T extends MappedEntityState<TypedActionObject>> {
  args: Extract<T['args$']>;
  cachedResponse: Extract<T['cachedResponse$']>;
  callState: Extract<T['callState$']>;
  entityId: Extract<T['entityId$']>;
  error: Extract<T['error$']>;
  isError: Extract<T['isError$']>;
  isInit: Extract<T['isInit$']>;
  isLoading: Extract<T['isLoading$']>;
  isPolling: Extract<T['isPolling$']>;
  isSuccess: Extract<T['isSuccess$']>;
  response: Extract<T['response$']>;
  timestamp: Extract<T['timestamp$']>;
  type: Extract<T['type$']>;
}

@Pipe({ name: 'suspense', pure: false })
export class SuspensePipe implements PipeTransform, OnDestroy {
  private _subscription: Subscription | null = null;
  private _currentMappedEntityState:
    | MappedEntityState<TypedActionObject>
    | undefined
    | null = null;

  private _state: State<any> | null = null;

  ngOnDestroy(): void {
    this._dispose();
  }

  transform<T extends MappedEntityState<TypedActionObject>>(
    value: T | null | undefined
  ): State<T> | null | undefined {
    if (!this._currentMappedEntityState) {
      if (value) {
        this._subscribe(value);
      }
    }

    if (this._currentMappedEntityState !== value) {
      this._dispose();
      return this.transform(value);
    }

    return value ? this._state : value;
  }

  private _subscribe(obj: MappedEntityState<TypedActionObject>) {
    this._currentMappedEntityState = obj;

    this._subscription = combineLatest([
      this._currentMappedEntityState.args$,
      this._currentMappedEntityState.cachedResponse$,
      this._currentMappedEntityState.callState$,
      this._currentMappedEntityState.entityId$,
      this._currentMappedEntityState.error$,
      this._currentMappedEntityState.isError$,
      this._currentMappedEntityState.isInit$,
      this._currentMappedEntityState.isLoading$,
      this._currentMappedEntityState.isPolling$,
      this._currentMappedEntityState.isSuccess$,
      this._currentMappedEntityState.response$,
      this._currentMappedEntityState.timestamp$,
      this._currentMappedEntityState.type$,
    ])
      .pipe(
        tap(
          ([
            args,
            cachedResponse,
            callState,
            entityId,
            error,
            isError,
            isInit,
            isLoading,
            isPolling,
            isSuccess,
            response,
            timestamp,
            type,
          ]) =>
            (this._state = {
              args,
              cachedResponse,
              callState,
              entityId,
              error,
              isError,
              isInit,
              isLoading,
              isPolling,
              isSuccess,
              response,
              timestamp,
              type,
            })
        )
      )
      .subscribe();
  }

  private _dispose() {
    this._subscription?.unsubscribe();
    this._currentMappedEntityState = null;
    this._state = null;
  }
}
