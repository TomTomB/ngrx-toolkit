import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { TypedActionObject } from '../types/types';
import { buildErrorFromHttpError } from './error.helpers';

export class EffectBase {
  constructor(private __actions$: Actions, private __featureService: any) {}

  onAction({
    action,
    serviceCall,
  }: {
    action: TypedActionObject;
    serviceCall: (args: any) => Observable<any>;
  }) {
    return createEffect(() =>
      this.__actions$.pipe(
        ofType(action.call),
        mergeMap(({ args }) =>
          serviceCall
            .bind(this.__featureService)(args)
            .pipe(
              map((response) => action.success({ response, args })),
              catchError((error) =>
                of(action.failure(buildErrorFromHttpError({ error, args })))
              )
            )
        )
      )
    );
  }
}
