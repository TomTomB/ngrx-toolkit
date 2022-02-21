import { Injectable } from '@angular/core';
import * as Actions from './sandbox.actions';
import * as fromReducer from './sandbox.reducer';
import * as Selectors from './sandbox.selectors';
import { Store } from '@ngrx/store';
import {
  ActionCallArgs,
  FacadeBase,
} from '../../../../ngrx-toolkit/src/public-api';
import { Actions as ActionsNative } from '@ngrx/effects';

@Injectable({ providedIn: 'root' })
export class SandboxFacade extends FacadeBase {
  constructor(
    private store: Store<fromReducer.SandboxPartialState>,
    private actions: ActionsNative
  ) {
    super(store, actions, Selectors.entitySelectors);
  }

  postSandbox(args: ActionCallArgs<typeof Actions.postSandbox>) {
    return this.call(Actions.postSandbox, args);
  }

  getFoo(args: ActionCallArgs<typeof Actions.getFoo>) {
    return this.call(Actions.getFoo, args);
  }

  getBar(args: ActionCallArgs<typeof Actions.getBar>) {
    return this.call(Actions.getBar, args);
  }

  benchmark(args: ActionCallArgs<typeof Actions.benchmark>) {
    return this.call(Actions.benchmark, args);
  }
}
