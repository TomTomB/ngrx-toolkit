import {
  ChangeDetectorRef,
  OnDestroy,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { startWith, tap } from 'rxjs/operators';
import { MappedEntityState, AnyTypedActionObject } from '../types';
import { State } from './types';

const DEFAULT_STATE: State<MappedEntityState<AnyTypedActionObject>> = {
  args: null,
  cachedResponse: null,
  callState: null,
  entityId: null,
  error: null,
  isError: false,
  isInit: false,
  isLoading: false,
  isPolling: false,
  isSuccess: false,
  refresh: () => {},
  remove: () => {},
  startPolling: () => {},
  stopPolling: () => {},
  response: null,
  timestamp: null,
  type: null,
} as const;

@Pipe({ name: 'suspense', pure: false })
export class SuspensePipe implements PipeTransform, OnDestroy {
  private _subscription: Subscription | null = null;
  private _currentMappedEntityState:
    | MappedEntityState<AnyTypedActionObject>
    | undefined
    | null = null;

  private _state: State<MappedEntityState<AnyTypedActionObject>> | null =
    DEFAULT_STATE;

  constructor(private _cdr: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    this._dispose();
  }

  transform<T extends MappedEntityState<AnyTypedActionObject>>(
    value: T | null | undefined
  ): State<T> {
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

    return this._state as any as State<T>;
  }

  private _subscribe(obj: MappedEntityState<AnyTypedActionObject>) {
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
              refresh:
                this._currentMappedEntityState?.refresh ??
                DEFAULT_STATE.refresh,
              remove:
                this._currentMappedEntityState?.remove ?? DEFAULT_STATE.remove,
              startPolling:
                this._currentMappedEntityState?.startPolling ??
                DEFAULT_STATE.startPolling,
              stopPolling:
                this._currentMappedEntityState?.stopPolling ??
                DEFAULT_STATE.stopPolling,
            };
            this._cdr.markForCheck();
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
