import { HttpErrorResponse } from '@angular/common/http';
import { Error } from '../types';

export const buildErrorFromHttpError = <T>({
  error,
  args,
  extras,
}: {
  error: HttpErrorResponse;
  args: T;
  extras?: {
    message?: string;
  };
}) => {
  const errorObj: Error = {
    status: error.status,
    message: extras?.message || error.message,
    violations: error.error?.violations || [],
  };

  return { error: errorObj, args };
};
