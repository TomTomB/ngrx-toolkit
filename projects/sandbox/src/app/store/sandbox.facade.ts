import { Injectable } from '@angular/core';
import { actionMap } from './sandbox.actions';
import * as fromReducer from './sandbox.reducer';
import * as Selectors from './sandbox.selectors';
import { Store } from '@ngrx/store';
import { FacadeBase } from '../../../../ngrx-toolkit/src/public-api';
import { Actions as ActionsNative } from '@ngrx/effects';

@Injectable({ providedIn: 'root' })
export class SandboxFacade extends FacadeBase<typeof actionMap> {
  constructor(
    store: Store<fromReducer.SandboxPartialState>,
    actions: ActionsNative
  ) {
    super(store, actions, Selectors.entitySelectors, actionMap);
  }
}
