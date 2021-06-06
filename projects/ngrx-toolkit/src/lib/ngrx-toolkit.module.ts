import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreDebugComponent } from './components/store-debug/store-debug.component';

@NgModule({
  declarations: [StoreDebugComponent],
  imports: [CommonModule],
  exports: [StoreDebugComponent],
})
export class NgRxToolkitModule {}
