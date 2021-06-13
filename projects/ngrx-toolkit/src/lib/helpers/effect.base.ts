import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FailureCreator, SuccessCreator } from '../types';
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

interface SideUpdateSuccess {
  action: SuccessCreator;
  mapFn?: (x: any) => any;
}

interface SideUpdateFailure {
  action: SuccessCreator;
  mapFn?: (x: any) => any;
}

type SideUpdates<SideUpdateArgs, MapFnArg> = {
  [Property in keyof SideUpdateArgs]: {
    action: SuccessCreator<SideUpdateArgs[Property], any>;
    mapFn?: (x: MapFnArg) => any;
  };
};

type ActionCallArgs<T extends TypedActionObject> = ReturnType<
  T['call']
>['args'];
type ActionSuccessResponse<T extends TypedActionObject> = ReturnType<
  T['success']
>['response'];
type ActionCallSideUpdates<T extends TypedActionObject> = ReturnType<
  T['call']
>['args']['sideUpdates'];

export class EffectBase {
  constructor(private __actions$: Actions, private __featureService: any) {}

  onActionSwitchMap<T extends TypedActionObject>({
    action,
    serviceCall,
    sideUpdates,
  }: {
    action: T;
    serviceCall: (
      args: ActionCallArgs<T>
    ) => Observable<ActionSuccessResponse<T>>;
    sideUpdates?: SideUpdates<
      ActionCallSideUpdates<T>,
      ActionSuccessResponse<T>
    >;
  }) {
    return createEffect(() =>
      this.__actions$.pipe(
        ofType(action.call),
        switchMap(({ args }) =>
          this._serviceCall(action, args, serviceCall, sideUpdates)
        )
      )
    );
  }

  onActionMergeMap<T extends TypedActionObject>({
    action,
    serviceCall,
  }: {
    action: T;
    serviceCall: (
      args: ActionCallArgs<T>
    ) => Observable<ActionSuccessResponse<T>>;
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
      args: ActionCallArgs<T>
    ) => Observable<ActionSuccessResponse<T>>;
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
      args: ActionCallArgs<T>
    ) => Observable<ActionSuccessResponse<T>>;
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
    args: ActionCallArgs<T>,
    serviceCall: (
      args: ActionCallArgs<T>
    ) => Observable<ActionSuccessResponse<T>>,
    sideUpdates?: SideUpdates<
      ActionCallSideUpdates<T>,
      ActionSuccessResponse<T>
    >
  ) {
    return serviceCall
      .bind(this.__featureService)(args)
      .pipe(
        map((response) => {
          const actionDefault = [action.success({ response, args })];

          if (sideUpdates) {
            for (const updateKey of Object.keys(sideUpdates)) {
              const update = sideUpdates[updateKey] as
                | SideUpdateSuccess
                | SideUpdateFailure;

              if (update.action.type.toLocaleLowerCase().includes('success')) {
                actionDefault.push(
                  update.action({
                    args: args['sideUpdates'][updateKey],
                    response: update.mapFn ? update.mapFn(response) : response,
                  })
                );
              }
            }
          }

          return actionDefault;
        }),
        switchMap((a) => a),
        catchError((error) => {
          const actionDefault = [
            action.failure(buildErrorFromHttpError({ error, args })),
          ];

          // if (action.sideUpdates?.failure) {
          //   actionDefault.push(
          //     ...action.sideUpdates.failure.map((a, i) =>
          //       a.action(
          //         buildErrorFromHttpError({
          //           error,
          //           args: args.sideUpdates.failure[i],
          //         })
          //       )
          //     )
          //   );
          // }

          return of(actionDefault).pipe(switchMap((a) => a));
        })
      );
  }
}
