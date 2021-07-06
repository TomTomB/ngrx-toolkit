import { Error } from '../types';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const uniformActionType = (type: string) =>
  type.replace(/^\s*|\s*$|(Success)|(Failure)/g, '');

export const joinLoading = (observables: Observable<boolean | null>[]) => {
  const copy = observables.filter((o) => !!o);

  return combineLatest(copy).pipe(
    map((o) => {
      for (const e of o) {
        if (e) {
          return true;
        }
      }
      return false;
    })
  );
};

export const joinErrors = (
  observables: Observable<Error<unknown> | null>[]
) => {
  const copy = observables.filter((o) => !!o);

  return combineLatest(copy).pipe(
    map((values) => {
      const errors: Error<unknown>[] = [];

      values.forEach((v) => {
        if (v) {
          errors.push(v);
        }
      });

      return errors.length ? errors : null;
    })
  );
};
