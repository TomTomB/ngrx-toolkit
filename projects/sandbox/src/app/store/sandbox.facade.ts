import { Injectable } from '@angular/core';
import { actionMap } from './sandbox.actions';
import { SandboxPartialState } from './sandbox.reducer';
import { entitySelectors } from './sandbox.selectors';
import { Store } from '@ngrx/store';
import { FacadeBase } from '../../../../ngrx-toolkit/src/public-api';
import { Actions } from '@ngrx/effects';

@Injectable({ providedIn: 'root' })
export class SandboxFacade extends FacadeBase<typeof actionMap> {
  constructor(store: Store<SandboxPartialState>, actions$: Actions) {
    super({
      store,
      actions$,
      entitySelectors,
      actionMap,
    });
  }
}
