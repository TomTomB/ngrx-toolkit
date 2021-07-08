import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreDebugComponent } from './components/store-debug/store-debug.component';
import { SuspensePipe } from './pipes/suspense.pipe';
import { SuspenseMultiPipe } from './pipes/suspense-multi.pipe';

@NgModule({
  declarations: [StoreDebugComponent, SuspensePipe, SuspenseMultiPipe],
  imports: [CommonModule],
  exports: [StoreDebugComponent, SuspensePipe, SuspenseMultiPipe],
})
export class NgRxToolkitModule {}
