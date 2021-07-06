import { Injectable } from '@angular/core';
import * as Actions from './sandbox.actions';
import * as fromReducer from './sandbox.reducer';
import * as Selectors from './sandbox.selectors';
import * as Models from './sandbox.models';
import { Store } from '@ngrx/store';
import { FacadeBase } from '../../../../ngrx-toolkit/src/public-api';
import { Actions as ActionsNative } from '@ngrx/effects';

@Injectable({ providedIn: 'root' })
export class SandboxFacade extends FacadeBase {
  constructor(
    private store: Store<fromReducer.SandboxPartialState>,
    private actions: ActionsNative
  ) {
    super(store, actions, Selectors.entitySelectors);
  }

  postSandbox(args: Models.PostSandboxArgs) {
    return this.call(Actions.postSandbox, args);
  }

  getFoo(args: Models.GetFooArgs) {
    return this.call(Actions.getFoo, args);
  }

  getBar(args: Models.GetBarArgs) {
    return this.call(Actions.getBar, args);
  }

  benchmark(args: Models.BenchmarkArgs) {
    return this.call(Actions.benchmark, args);
  }
}
