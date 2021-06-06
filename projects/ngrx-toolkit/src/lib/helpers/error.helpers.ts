import { HttpErrorResponse } from '@angular/common/http';
import { Error, FirebaseError } from '../types';

export const isFirebaseError = (
  err: HttpErrorResponse | FirebaseError
): err is FirebaseError => !!(err as any).code;

export const buildErrorFromHttpError = <T, J>({
  error,
  args,
  extras,
}: {
  error: HttpErrorResponse | FirebaseError;
  args: T;
  extras?: {
    message?: string;
  };
}) => {
  if (isFirebaseError(error)) {
    const err: Error<J> = {
      message: extras?.message || error.message,
      status: error.code,
      data: null,
    };
    return { error: err, args };
  }

  const errorObj: Error<J> = {
    status: error.status,
    message: extras?.message || error.message,
    data: error.error,
  };

  return { error: errorObj, args };
};
