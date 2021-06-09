import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import {
  catchError,
  concatMap,
  exhaustMap,
  map,
  mergeMap,
  switchMap,
} from 'rxjs/operators';
import { TypedActionObject } from '../types/types';
import { buildErrorFromHttpError } from './error.helpers';

export class EffectBase {
  constructor(private __actions$: Actions, private __featureService: any) {}

  onActionSwitchMap<T extends TypedActionObject>({
    action,
    serviceCall,
  }: {
    action: T;
    serviceCall: (
      args: ReturnType<T['call']>['args']
    ) => Observable<ReturnType<T['success']>['response']>;
  }) {
    return createEffect(() =>
      this.__actions$.pipe(
        ofType(action.call),
        switchMap(({ args }) => this._serviceCall(action, args, serviceCall))
      )
    );
  }

  onActionMergeMap<T extends TypedActionObject>({
    action,
    serviceCall,
  }: {
    action: T;
    serviceCall: (
      args: ReturnType<T['call']>['args']
    ) => Observable<ReturnType<T['success']>['response']>;
  }) {
    return createEffect(() =>
      this.__actions$.pipe(
        ofType(action.call),
        mergeMap(({ args }) => this._serviceCall(action, args, serviceCall))
      )
    );
  }

  onActionExhaustMap<T extends TypedActionObject>({
    action,
    serviceCall,
  }: {
    action: T;
    serviceCall: (
      args: ReturnType<T['call']>['args']
    ) => Observable<ReturnType<T['success']>['response']>;
  }) {
    return createEffect(() =>
      this.__actions$.pipe(
        ofType(action.call),
        exhaustMap(({ args }) => this._serviceCall(action, args, serviceCall))
      )
    );
  }

  onActionConcatMap<T extends TypedActionObject>({
    action,
    serviceCall,
  }: {
    action: T;
    serviceCall: (
      args: ReturnType<T['call']>['args']
    ) => Observable<ReturnType<T['success']>['response']>;
  }) {
    return createEffect(() =>
      this.__actions$.pipe(
        ofType(action.call),
        concatMap(({ args }) => this._serviceCall(action, args, serviceCall))
      )
    );
  }

  private _serviceCall<T extends TypedActionObject>(
    action: T,
    args: ReturnType<T['call']>['args'],
    serviceCall: (
      args: ReturnType<T['call']>['args']
    ) => Observable<ReturnType<T['success']>['response']>
  ) {
    return serviceCall
      .bind(this.__featureService)(args)
      .pipe(
        map((response) => action.success({ response, args })),
        catchError((error) =>
          of(action.failure(buildErrorFromHttpError({ error, args })))
        )
      );
  }
}
