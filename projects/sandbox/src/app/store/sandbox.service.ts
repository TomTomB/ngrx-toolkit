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
import { actionMap } from './sandbox.actions';

@Injectable({
  providedIn: 'root',
})
export class SandboxService extends ServiceBase<typeof actionMap> {
  constructor(private _http: HttpClient) {
    super(_http, 'https://jsonplaceholder.typicode.com', actionMap, {
      queryParams: { foo: 'asad' },
    });

    this.createServiceCalls({
      getFoo: { route: (p) => `/todos/${p.sandboxSlug}` },
    });
  }

  postSandbox(args: ActionCallArgs<typeof actionMap['postSandbox']>) {
    return this.get({
      apiRoute: (p) => `/todos/${p.sandboxTest}`,
      httpOpts: args,
      responseType: defineResponseType<Models.Sandbox>(),
    });
  }

  getFoo(args: ActionCallArgs<typeof actionMap['getFoo']>) {
    return this.post({
      apiRoute: (p) => `/todos/${p.sandboxSlug}`,
      httpOpts: args,
      responseType: defineResponseType<Models.Sandbox>(),
    });
  }

  getBar(args: ActionCallArgs<typeof actionMap['getBar']>) {
    return this.get({
      apiRoute: `/todos/1`,
      httpOpts: args,
      responseType: defineResponseType<{ value: boolean }>(),
      extras: {
        skipCache: true,
      },
    }).pipe(map((v) => ({ value: !!v })));
  }

  benchmark(args: ActionCallArgs<typeof actionMap['benchmark']>) {
    return of({ value: true });
  }
}
