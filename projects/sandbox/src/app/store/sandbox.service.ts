import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  defineResponseType,
  ServiceBase,
} from '../../../../ngrx-toolkit/src/public-api';
import * as Models from './sandbox.models';

@Injectable({
  providedIn: 'root',
})
export class SandboxService extends ServiceBase {
  constructor(private _http: HttpClient) {
    super(_http, 'https://jsonplaceholder.typicode.com', {
      queryParams: { foo: 'asad' },
    });
  }

  postSandbox(args: Models.PostSandboxArgs) {
    return this.get({
      apiRoute: (p) => `/todos/${p.sandboxTest}`,
      httpOpts: args,
      responseType: defineResponseType<Models.Sandbox>(),
    });
  }

  getFoo(args: Models.GetFooArgs) {
    return this.post({
      apiRoute: (p) => `/todos/${p.sandboxSlug}`,
      httpOpts: args,
      responseType: defineResponseType<Models.Sandbox>(),
    });
  }

  getBar(args: Models.GetBazArgs) {
    return this.get({
      apiRoute: `/todos/1`,
      httpOpts: args,
      responseType: defineResponseType<{ value: boolean }>(),
      extras: {
        skipCache: true,
      },
    }).pipe(map((v) => ({ value: !!v })));
  }

  benchmark(args: Models.BenchmarkArgs) {
    return of({ value: true });
  }
}
