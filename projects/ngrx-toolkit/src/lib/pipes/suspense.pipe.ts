import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { startWith, tap } from 'rxjs/operators';
import { MappedEntityState, TypedActionObject } from '../types';
import { State } from './types';

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
      this._currentMappedEntityState.cachedResponse$.pipe(startWith(null)),
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
          ]) => {
            this._state = {
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
              refresh: this._currentMappedEntityState?.refresh,
              remove: this._currentMappedEntityState?.remove,
            };
          }
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
