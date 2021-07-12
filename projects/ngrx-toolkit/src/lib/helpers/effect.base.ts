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
import {
  ActionCallArgs,
  ActionCallSideUpdates,
  ActionSuccessResponse,
  TypedActionObject,
} from '../types/types';
import { buildErrorFromHttpError } from './error.helpers';
import { Action } from '@ngrx/store';

type SideUpdateObject<
  SuccessArgs = any,
  SuccessResponse = any,
  OriginSuccessResponse = any
> = {
  action: SuccessCreator<SuccessArgs, SuccessResponse>;
  mapFn?: (x: OriginSuccessResponse) => SuccessResponse;
};

type SideUpdates<
  SideUpdateArgs,
  MapFnArg,
  UpdateConfig extends SideUpdates<SideUpdateArgs, MapFnArg, UpdateConfig>
> = {
  [Property in keyof SideUpdateArgs]: MapFnArg extends ReturnType<
    UpdateConfig[Property]['action']
  >['response']
    ? SideUpdateObject<
        SideUpdateArgs[Property],
        ReturnType<UpdateConfig[Property]['action']>['response'],
        MapFnArg
      >
    : Required<
        SideUpdateObject<
          SideUpdateArgs[Property],
          ReturnType<UpdateConfig[Property]['action']>['response'],
          MapFnArg
        >
      >;
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

//FIXME (TRB): Type checking does not work for arg type

export class EffectBase {
  constructor(private __actions$: Actions, private __featureService: any) {}

  onActionSwitchMap<
    TAO extends TypedActionObject,
    SU extends SideUpdates<
      ActionCallSideUpdates<TAO>,
      ActionSuccessResponse<TAO>,
      SU
    >
  >({ action, serviceCall, sideUpdates }: OnActionArgs<TAO, SU>) {
    return createEffect(() =>
      this.__actions$.pipe(
        ofType(action.call),
        switchMap(({ args }: { args: ReturnType<TAO['call']>['args'] }) =>
          this._serviceCall(action, args, serviceCall, sideUpdates)
        )
      )
    );
  }

  onActionMergeMap<
    TAO extends TypedActionObject,
    SU extends SideUpdates<
      ActionCallSideUpdates<TAO>,
      ActionSuccessResponse<TAO>,
      SU
    >
  >({ action, serviceCall, sideUpdates }: OnActionArgs<TAO, SU>) {
    return createEffect(() =>
      this.__actions$.pipe(
        ofType(action.call),
        mergeMap(({ args }: { args: ReturnType<TAO['call']>['args'] }) =>
          this._serviceCall(action, args, serviceCall, sideUpdates)
        )
      )
    );
  }

  onActionExhaustMap<
    TAO extends TypedActionObject,
    SU extends SideUpdates<
      ActionCallSideUpdates<TAO>,
      ActionSuccessResponse<TAO>,
      SU
    >
  >({ action, serviceCall, sideUpdates }: OnActionArgs<TAO, SU>) {
    return createEffect(() =>
      this.__actions$.pipe(
        ofType(action.call),
        exhaustMap(({ args }: { args: ReturnType<TAO['call']>['args'] }) =>
          this._serviceCall(action, args, serviceCall, sideUpdates)
        )
      )
    );
  }

  onActionConcatMap<
    TAO extends TypedActionObject,
    SU extends SideUpdates<
      ActionCallSideUpdates<TAO>,
      ActionSuccessResponse<TAO>,
      SU
    >
  >({ action, serviceCall, sideUpdates }: OnActionArgs<TAO, SU>) {
    return createEffect(() =>
      this.__actions$.pipe(
        ofType(action.call),
        concatMap(({ args }: { args: ReturnType<TAO['call']>['args'] }) =>
          this._serviceCall(action, args, serviceCall, sideUpdates)
        )
      )
    );
  }

  private _serviceCall<
    TAO extends TypedActionObject,
    SU extends SideUpdates<
      ActionCallSideUpdates<TAO>,
      ActionSuccessResponse<TAO>,
      SU
    >,
    ACA extends ActionCallArgs<TAO>
  >(
    action: TAO,
    args: ACA,
    serviceCall: (args: ACA) => Observable<ActionSuccessResponse<TAO>>,
    sideUpdates?: SU
  ) {
    return serviceCall
      .bind(this.__featureService)(args)
      .pipe(
        map((response) => {
          const actionDefault: Action[] = [action.success({ response, args })];

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
