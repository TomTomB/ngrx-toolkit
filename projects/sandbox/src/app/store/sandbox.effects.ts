import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { EffectBase } from '../../../../ngrx-toolkit/src/public-api';
import { actionMap } from './sandbox.actions';
import { SandboxService } from './sandbox.service';

@Injectable()
export class SandboxEffects extends EffectBase {
  postSandbox$ = this.onActionSwitchMap({
    action: actionMap.postSandbox,
    serviceCall: this.featureService.postSandbox,
    sideUpdates: {
      getFoo: {
        action: actionMap.getFoo.success,
        mapFn: (x) => x,
      },
      getBar: {
        action: actionMap.getBar.success,
        mapFn: (x) => ({ value: !!x }),
      },
    },
  });
  getFoo$ = this.onActionSwitchMap({
    action: actionMap.getFoo,
    serviceCall: this.featureService.getFoo,
  });
  getBar$ = this.onActionSwitchMap({
    action: actionMap.getBar,
    serviceCall: this.featureService.getBar,
  });
  benchmark$ = this.onActionSwitchMap({
    action: actionMap.benchmark,
    serviceCall: this.featureService.benchmark,
  });

  constructor(
    private actions$: Actions,
    private featureService: SandboxService
  ) {
    super(actions$, featureService);
  }
}
