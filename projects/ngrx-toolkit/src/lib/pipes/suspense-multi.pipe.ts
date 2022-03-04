import {
  ChangeDetectorRef,
  OnDestroy,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { MappedEntityState, AnyTypedActionObject } from '../types';
import { State } from './types';

@Pipe({ name: 'suspenseMulti', pure: false })
export class SuspenseMultiPipe implements PipeTransform, OnDestroy {
  private _subscription: Subscription | null = null;
  private _currentMappedEntityState:
    | Record<string, MappedEntityState<AnyTypedActionObject> | null | undefined>
    | undefined
    | null = null;

  private _state: Record<string, State<any>> = {};

  constructor(private _cdr: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    this._dispose();
  }

  transform<
    T extends Record<
      string,
      MappedEntityState<AnyTypedActionObject> | null | undefined
    >
  >(
    value: T | null | undefined
  ):
    | {
        [Property in keyof T]: State<T[Property]>;
      } {
    if (!this._currentMappedEntityState) {
      if (value) {
        this._subscribe(value);
      }
    }

    if (this._currentMappedEntityState !== value) {
      this._dispose();

      if (value) {
        this._subscribe(value);
      }
    }

    return this._state as any as {
      [Property in keyof T]: State<T[Property]>;
    };
  }

  private _subscribe(
    obj: Record<
      string,
      MappedEntityState<AnyTypedActionObject> | null | undefined
    >
  ) {
    this._currentMappedEntityState = obj;

    const obs: Observable<any>[] = [];

    for (const key of Object.keys(obj)) {
      const s = obj[key];

      if (s) {
        const newObs = combineLatest([
          s.args$,
          s.callState$,
          s.cachedResponse$.pipe(startWith(null)),
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
        ]).pipe(
          map(
            ([
              args,
              callState,
              cachedResponse,
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
              return {
                key,
                args,
                callState,
                cachedResponse,
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
                refresh: s.refresh,
                remove: s.remove,
              };
            }
          )
        );

        obs.push(newObs);
      }
    }

    const sub = combineLatest(obs)
      .pipe(
        tap((valueMap) => {
          const newObj: Record<string, any> = {};

          for (const val of valueMap) {
            newObj[val.key] = val;
          }

          this._state = newObj;

          this._cdr.markForCheck();
        })
      )
      .subscribe();

    this._subscription = sub;
  }

  private _dispose() {
    this._subscription?.unsubscribe();
    this._subscription = null;
    this._currentMappedEntityState = null;
    this._state = {};
  }
}
