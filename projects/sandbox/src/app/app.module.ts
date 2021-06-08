import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgRxToolkitModule } from '../../../ngrx-toolkit/src/public-api';
import { AppComponent } from './app.component';
import { SandboxEffects } from './store/sandbox.effects';
import { reducer, SANDBOX_FEATURE_KEY } from './store/sandbox.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    StoreModule.forRoot({ [SANDBOX_FEATURE_KEY]: reducer }),
    EffectsModule.forRoot([SandboxEffects]),
    NgRxToolkitModule,
    StoreDevtoolsModule.instrument({
      maxAge: 100,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
