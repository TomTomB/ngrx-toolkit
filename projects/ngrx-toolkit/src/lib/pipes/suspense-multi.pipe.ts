import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MappedEntityState, TypedActionObject } from '../types';
import { State } from './types';

@Pipe({ name: 'suspenseMulti', pure: false })
export class SuspenseMultiPipe implements PipeTransform, OnDestroy {
  private _subscriptions: Subscription[] = [];
  private _currentMappedEntityState:
    | Record<string, MappedEntityState<TypedActionObject> | null | undefined>
    | undefined
    | null = null;

  private _state: Record<string, State<any>> = {};

  ngOnDestroy(): void {
    this._dispose();
  }

  transform<
    T extends Record<
      string,
      MappedEntityState<TypedActionObject> | null | undefined
    >
  >(
    value: T | null | undefined
  ):
    | {
        [Property in keyof T]: State<T[Property]>;
      }
    | null {
    if (!this._currentMappedEntityState) {
      if (value) {
        this._subscribe(value);
      }
    }

    if (this._currentMappedEntityState !== value) {
      this._dispose();
      return this.transform(value);
    }

    return value && Object.keys(this._state).length
      ? (this._state as any as {
          [Property in keyof T]: State<T[Property]>;
        })
      : null;
  }

  private _subscribe(
    obj: Record<string, MappedEntityState<TypedActionObject> | null | undefined>
  ) {
    this._currentMappedEntityState = obj;

    console.log('here');

    Object.keys(obj).forEach((key) => {
      const s = obj[key];
      console.log('here', s, key);

      if (s) {
        const sub = combineLatest([
          s.args$,
          s.cachedResponse$,
          s.callState$,
          s.entityId$,
          s.error$,
          s.isError$,
          s.isInit$,
          s.isLoading$,
          s.isPolling$,
          s.isSuccess$,
          s.response$,
          s.timestamp$,
          s.type$,
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
                console.log(this._state, key);

                this._state = {
                  ...this._state,
                  [key]: {
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
                  },
                };

                console.log(this._state, key);
              }
            )
          )
          .subscribe();

        this._subscriptions.push(sub);
      }
    });
  }

  private _dispose() {
    this._subscriptions.forEach((s) => s.unsubscribe());
    this._subscriptions = [];
    this._currentMappedEntityState = null;
    this._state = {};
  }
}
