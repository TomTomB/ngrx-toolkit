import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { EffectBase } from '../../../../ngrx-toolkit/src/public-api';
import * as SandboxActions from './sandbox.actions';
import { SandboxService } from './sandbox.service';

@Injectable()
export class SandboxEffects extends EffectBase {
  postSandbox$ = this.onAction({
    action: SandboxActions.postSandbox,
    serviceCall: this.featureService.postSandbox,
  });

  constructor(
    private actions$: Actions,
    private featureService: SandboxService
  ) {
    super(actions$, featureService);
  }
}
