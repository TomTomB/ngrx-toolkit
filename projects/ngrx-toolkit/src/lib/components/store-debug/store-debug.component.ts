import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { MappedEntityState } from '../../types/types';

@Component({
  selector: 'ngrx-toolkit-store-debug',
  templateUrl: './store-debug.component.html',
  styles: [
    `
      .store-debug {
        padding: 1rem 1rem 2.5rem;
        background-color: blue;
        border: 2px solid red;
        height: 372px;
        overflow: auto;
        margin-bottom: 2rem;
        color: #fff;
      }

      .store-debug h1 {
        margin-bottom: 0;
        font-weight: 700;
        padding-left: 16px;
        color: #fff;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreDebugComponent {
  @Input()
  store?: MappedEntityState<any>;
}
