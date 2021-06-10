import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServiceBase } from '../../../../ngrx-toolkit/src/public-api';
import * as fromModels from './sandbox.models';

@Injectable({
  providedIn: 'root',
})
export class SandboxService extends ServiceBase {
  constructor(private _http: HttpClient) {
    super(_http, 'https://jsonplaceholder.typicode.com');
  }

  postSandbox(args: fromModels.PostSandboxArgs) {
    return this.get<fromModels.Sandbox>({
      apiRoute: '/todos/1',
      httpOpts: args,
    });
  }

  getFoo(args: fromModels.GetFooArgs) {
    return this.get<fromModels.Sandbox>({
      apiRoute: '/todos/1',
      httpOpts: args,
    });
  }
}
