import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SuccessCreator } from '../types';
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

type ActionCallArgs<T extends TypedActionObject> = ReturnType<
  T['call']
>['args'];
type ActionSuccessResponse<T extends TypedActionObject> = ReturnType<
  T['success']
>['response'];
type ActionCallSideUpdates<T extends TypedActionObject> = ReturnType<
  T['call']
>['args']['sideUpdates'];

interface SideUpdateObject<SuccessResponse = any, J = any> {
  action: SuccessCreator;
  mapFn?: (x: SuccessResponse) => J;
}

type SideUpdates<
  SideUpdateArgs,
  MapFnArg,
  UpdateConfig extends SideUpdates<SideUpdateArgs, MapFnArg, UpdateConfig>
> = {
  [Property in keyof SideUpdateArgs]: {
    action: SuccessCreator<
      SideUpdateArgs[Property],
      ReturnType<UpdateConfig[Property]['action']>['response']
    >;
    mapFn?: (
      x: MapFnArg
    ) => ReturnType<UpdateConfig[Property]['action']>['response'];
  };
};

type OnActionArgs<
  T extends TypedActionObject,
  J extends SideUpdates<ActionCallSideUpdates<T>, ActionSuccessResponse<T>, J>
> = ActionCallSideUpdates<T> extends Record<string, any>
  ? {
      action: T;
      serviceCall: (
        args: ActionCallArgs<T>
      ) => Observable<ActionSuccessResponse<T>>;
      sideUpdates: J;
    }
  : {
      action: T;
      serviceCall: (
        args: ActionCallArgs<T>
      ) => Observable<ActionSuccessResponse<T>>;
      sideUpdates?: never;
    };

export class EffectBase {
  constructor(private __actions$: Actions, private __featureService: any) {}

  onActionSwitchMap<
    T extends TypedActionObject,
    J extends SideUpdates<ActionCallSideUpdates<T>, ActionSuccessResponse<T>, J>
  >({ action, serviceCall, sideUpdates }: OnActionArgs<T, J>) {
    return createEffect(() =>
      this.__actions$.pipe(
        ofType(action.call),
        switchMap(({ args }) =>
          this._serviceCall(action, args, serviceCall, sideUpdates)
        )
      )
    );
  }

  onActionMergeMap<
    T extends TypedActionObject,
    J extends SideUpdates<ActionCallSideUpdates<T>, ActionSuccessResponse<T>, J>
  >({ action, serviceCall, sideUpdates }: OnActionArgs<T, J>) {
    return createEffect(() =>
      this.__actions$.pipe(
        ofType(action.call),
        mergeMap(({ args }) =>
          this._serviceCall(action, args, serviceCall, sideUpdates)
        )
      )
    );
  }

  onActionExhaustMap<
    T extends TypedActionObject,
    J extends SideUpdates<ActionCallSideUpdates<T>, ActionSuccessResponse<T>, J>
  >({ action, serviceCall, sideUpdates }: OnActionArgs<T, J>) {
    return createEffect(() =>
      this.__actions$.pipe(
        ofType(action.call),
        exhaustMap(({ args }) =>
          this._serviceCall(action, args, serviceCall, sideUpdates)
        )
      )
    );
  }

  onActionConcatMap<
    T extends TypedActionObject,
    J extends SideUpdates<ActionCallSideUpdates<T>, ActionSuccessResponse<T>, J>
  >({ action, serviceCall, sideUpdates }: OnActionArgs<T, J>) {
    return createEffect(() =>
      this.__actions$.pipe(
        ofType(action.call),
        concatMap(({ args }) =>
          this._serviceCall(action, args, serviceCall, sideUpdates)
        )
      )
    );
  }

  private _serviceCall<
    T extends TypedActionObject,
    J extends SideUpdates<ActionCallSideUpdates<T>, ActionSuccessResponse<T>, J>
  >(
    action: T,
    args: ActionCallArgs<T>,
    serviceCall: (
      args: ActionCallArgs<T>
    ) => Observable<ActionSuccessResponse<T>>,
    sideUpdates?: J
  ) {
    return serviceCall
      .bind(this.__featureService)(args)
      .pipe(
        map((response) => {
          const actionDefault = [action.success({ response, args })];

          if (sideUpdates) {
            for (const updateKey of Object.keys(sideUpdates)) {
              const update = sideUpdates[updateKey] as SideUpdateObject;

              actionDefault.push(
                update.action({
                  args: args['sideUpdates'][updateKey],
                  response: update.mapFn ? update.mapFn(response) : response,
                })
              );
            }
          }

          return actionDefault;
        }),
        switchMap((a) => a),
        catchError((error) =>
          of(action.failure(buildErrorFromHttpError({ error, args })))
        )
      );
  }
}
