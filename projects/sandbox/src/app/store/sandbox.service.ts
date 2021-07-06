import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServiceBase } from '../../../../ngrx-toolkit/src/public-api';
import * as Models from './sandbox.models';

@Injectable({
  providedIn: 'root',
})
export class SandboxService extends ServiceBase {
  constructor(private _http: HttpClient) {
    super(_http, 'https://jsonplaceholder.typicode.com');
  }

  postSandbox(args: Models.PostSandboxArgs) {
    return this.get<Models.Sandbox>({
      apiRoute: '/todos/1',
      httpOpts: args,
    });
  }

  getFoo(args: Models.GetFooArgs) {
    return this.post<Models.Sandbox>({
      apiRoute: '/todos/1',
      httpOpts: args,
    });
  }

  getBar(args: Models.GetBarArgs) {
    return this.get<{ value: boolean }>({
      apiRoute: '/todos/1',
      httpOpts: args,
      extras: {
        skipCache: true,
      },
    }).pipe(map((v) => ({ value: !!v })));
  }

  benchmark(args: Models.BenchmarkArgs) {
    return of({ value: true });
  }
}
