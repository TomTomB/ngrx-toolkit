import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ActionCallArgs,
  defineResponseType,
  ServiceBase,
} from '../../../../ngrx-toolkit/src/public-api';
import * as Models from './sandbox.models';
import * as Actions from './sandbox.actions';

@Injectable({
  providedIn: 'root',
})
export class SandboxService extends ServiceBase {
  constructor(private _http: HttpClient) {
    super(_http, 'https://jsonplaceholder.typicode.com', {
      queryParams: { foo: 'asad' },
    });
  }

  postSandbox(args: ActionCallArgs<typeof Actions.postSandbox>) {
    return this.get({
      apiRoute: (p) => `/todos/${p.sandboxTest}`,
      httpOpts: args,
      responseType: defineResponseType<Models.Sandbox>(),
    });
  }

  getFoo(args: ActionCallArgs<typeof Actions.getFoo>) {
    return this.post({
      apiRoute: (p) => `/todos/${p.sandboxSlug}`,
      httpOpts: args,
      responseType: defineResponseType<Models.Sandbox>(),
    });
  }

  getBar(args: ActionCallArgs<typeof Actions.getBar>) {
    return this.get({
      apiRoute: `/todos/1`,
      httpOpts: args,
      responseType: defineResponseType<{ value: boolean }>(),
      extras: {
        skipCache: true,
      },
    }).pipe(map((v) => ({ value: !!v })));
  }

  benchmark(args: ActionCallArgs<typeof Actions.benchmark>) {
    return of({ value: true });
  }
}
