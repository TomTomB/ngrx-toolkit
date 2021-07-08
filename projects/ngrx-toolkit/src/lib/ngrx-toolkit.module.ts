import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreDebugComponent } from './components/store-debug/store-debug.component';
import { SuspensePipe } from './components/suspense/suspense.pipe';

@NgModule({
  declarations: [StoreDebugComponent, SuspensePipe],
  imports: [CommonModule],
  exports: [StoreDebugComponent, SuspensePipe],
})
export class NgRxToolkitModule {}
