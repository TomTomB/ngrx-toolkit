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
        map((response) => {
          const actionDefault = [action.success({ response, args })];

          if (action.sideUpdates?.success) {
            actionDefault.push(
              ...action.sideUpdates.success.map((a, i) =>
                a.action({ args: args.sideUpdateArgs.success[i], response })
              )
            );
          }

          return actionDefault;
        }),
        switchMap((a) => a),
        catchError((error) => {
          const actionDefault = [
            action.failure(buildErrorFromHttpError({ error, args })),
          ];

          if (action.sideUpdates?.failure) {
            actionDefault.push(
              ...action.sideUpdates.failure.map((a, i) =>
                a.action(
                  buildErrorFromHttpError({
                    error,
                    args: args.sideUpdateArgs.failure[i],
                  })
                )
              )
            );
          }

          return of(actionDefault).pipe(switchMap((a) => a));
        })
      );
  }
}
