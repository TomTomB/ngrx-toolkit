import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServiceBase } from '../helpers';
import * as fromModels from './sandbox.models';

@Injectable({
  providedIn: 'root',
})
export class SandboxService extends ServiceBase {
  constructor(private _http: HttpClient) {
    super(_http, 'http://example.com/api');
  }

  postSandbox(args: fromModels.PostSandboxArgs) {
    return this.post({ apiRoute: '/sandbox', httpOpts: args });
  }
}
