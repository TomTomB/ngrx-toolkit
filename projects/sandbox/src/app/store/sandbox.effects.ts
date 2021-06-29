import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { EffectBase } from '../../../../ngrx-toolkit/src/public-api';
import * as FeatureActions from './sandbox.actions';
import { SandboxService } from './sandbox.service';

@Injectable()
export class SandboxEffects extends EffectBase {
  postSandbox$ = this.onActionSwitchMap({
    action: FeatureActions.postSandbox,
    serviceCall: this.featureService.postSandbox,
    sideUpdates: {
      getFoo: { action: FeatureActions.getFoo.success, mapFn: (x) => x },
      getBar: {
        action: FeatureActions.getBar.success,
        mapFn: (x) => ({ value: !!x }),
      },
    },
  });
  getFoo$ = this.onActionSwitchMap({
    action: FeatureActions.getFoo,
    serviceCall: this.featureService.getFoo,
  });
  getBar$ = this.onActionSwitchMap({
    action: FeatureActions.getBar,
    serviceCall: this.featureService.getBar,
  });

  constructor(
    private actions$: Actions,
    private featureService: SandboxService
  ) {
    super(actions$, featureService);
  }
}
