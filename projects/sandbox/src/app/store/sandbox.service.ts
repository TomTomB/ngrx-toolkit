import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServiceBase } from '../../../../ngrx-toolkit/src/public-api';
import { actionMap } from './sandbox.actions';

@Injectable({
  providedIn: 'root',
})
export class SandboxService extends ServiceBase<typeof actionMap> {
  constructor(http: HttpClient) {
    super({
      http,
      actionMap,
      baseConfig: {
        apiBase: 'https://jsonplaceholder.typicode.com',
        queryParams: { foo: 'asad' },
      },
      callConfig: {
        getFoo: { route: (p) => `/todos/${p.sandboxSlug}` },
        postSandbox: { route: (p) => `/todos/${p.sandboxTest}` },
        benchmark: { route: (p) => `/todos/${p.benchmark}` },
        getBar: { route: `/todos/1` },
      },
    });
  }
}
