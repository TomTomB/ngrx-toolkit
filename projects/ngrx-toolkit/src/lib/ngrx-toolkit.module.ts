import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreDebugComponent } from './components/store-debug/store-debug.component';
import { SuspenseDirective } from './components/suspense/suspense.directive';

@NgModule({
  declarations: [StoreDebugComponent, SuspenseDirective],
  imports: [CommonModule],
  exports: [StoreDebugComponent, SuspenseDirective],
})
export class NgRxToolkitModule {}
