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

  /**
   * @deprecated use `onActionMergeMap` or `onActionSwitchMap`
   */
  onAction({
    action,
    serviceCall,
  }: {
    action: TypedActionObject;
    serviceCall: (args: any) => Observable<any>;
  }) {
    return this.onActionMergeMap({ action, serviceCall });
  }

  onActionSwitchMap({
    action,
    serviceCall,
  }: {
    action: TypedActionObject;
    serviceCall: (args: any) => Observable<any>;
  }) {
    return createEffect(() =>
      this.__actions$.pipe(
        ofType(action.call),
        switchMap(({ args }) => this._serviceCall(action, args, serviceCall))
      )
    );
  }

  onActionMergeMap({
    action,
    serviceCall,
  }: {
    action: TypedActionObject;
    serviceCall: (args: any) => Observable<any>;
  }) {
    return createEffect(() =>
      this.__actions$.pipe(
        ofType(action.call),
        mergeMap(({ args }) => this._serviceCall(action, args, serviceCall))
      )
    );
  }

  onActionExhaustMap({
    action,
    serviceCall,
  }: {
    action: TypedActionObject;
    serviceCall: (args: any) => Observable<any>;
  }) {
    return createEffect(() =>
      this.__actions$.pipe(
        ofType(action.call),
        exhaustMap(({ args }) => this._serviceCall(action, args, serviceCall))
      )
    );
  }

  onActionConcatMap({
    action,
    serviceCall,
  }: {
    action: TypedActionObject;
    serviceCall: (args: any) => Observable<any>;
  }) {
    return createEffect(() =>
      this.__actions$.pipe(
        ofType(action.call),
        concatMap(({ args }) => this._serviceCall(action, args, serviceCall))
      )
    );
  }

  private _serviceCall(
    action: TypedActionObject,
    args: any,
    serviceCall: (args: any) => Observable<any>
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
