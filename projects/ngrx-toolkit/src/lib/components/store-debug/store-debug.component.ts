import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { MappedEntityState } from '../../types/types';
import packageJson from '../../../../../../package.json';
import { UNIQUE_ID } from '../../helpers';

type UiState =
  | 'overview'
  | 'args'
  | 'error'
  | 'response'
  | 'truthy-response'
  | 'falsy-response';

@Component({
  selector: 'ngrx-toolkit-store-debug',
  templateUrl: './store-debug.component.html',
  styleUrls: ['./store-debug.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class StoreDebugComponent {
  @Input()
  store?: MappedEntityState<any>;

  uiState: UiState = 'overview';

  version = packageJson.version;

  uniqueId = UNIQUE_ID;

  setUiState(newUiState: UiState) {
    this.uiState = newUiState;
  }

  formatBytes(bytes: number | undefined, decimals = 2) {
    if (bytes === undefined) {
      return null;
    }

    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
