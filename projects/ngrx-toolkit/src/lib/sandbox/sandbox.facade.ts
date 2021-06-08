import { Injectable } from '@angular/core';
import * as Actions from './sandbox.actions';
import * as fromReducer from './sandbox.reducer';
import * as Selectors from './sandbox.selectors';
import * as fromModels from './sandbox.models';
import { Store } from '@ngrx/store';
import { FacadeBase } from '../helpers';
import { Actions as ActionsNative } from '@ngrx/effects';

@Injectable({ providedIn: 'root' })
export class AuthFacade extends FacadeBase {
  constructor(
    private store: Store<fromReducer.SandboxPartialState>,
    private actions: ActionsNative
  ) {
    super(store, actions, Selectors.entitySelectors);
  }

  postSandbox(args: fromModels.PostSandboxArgs) {
    return this.select(
      Actions.postSandbox,
      this._dispatch(Actions.postSandbox.call({ args }))
    );
  }
}
