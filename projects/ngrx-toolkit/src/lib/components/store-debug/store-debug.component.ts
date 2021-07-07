import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewEncapsulation,
  OnDestroy,
} from '@angular/core';
import { MappedEntityState } from '../../types/types';
import { UNIQUE_ID } from '../../helpers';
import { Subject } from 'rxjs';

type UiState = 'overview' | 'args' | 'error' | 'response' | 'cached-response';

@Component({
  selector: 'ngrxt-store-debug',
  templateUrl: './store-debug.component.html',
  styles: [
    `
      :host {
        display: grid;
        grid-template-columns: auto 1fr;
        font-family: Arial, Helvetica, sans-serif;
        background: rgb(48, 48, 48);
        border-radius: 6px;
        color: #fff;
        margin-bottom: 1rem;
      }

      .store-debug {
        padding: 1rem 1rem 2rem;
        height: 390px;
        overflow: auto;
        color: #fff;
        border-left: 1px solid rgb(151, 151, 151);
      }

      ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
      }

      .head {
        padding: 12px 18px 6px 12px;
        font-size: 12px;
        text-align: left;
      }

      ul button {
        all: unset;
        width: calc(100% - 24px);
        text-align: left;
        padding: 4px 12px;
        cursor: pointer;
      }

      ul button:hover,
      ul button:focus-visible {
        background-color: rgb(102, 102, 102);
      }

      ul button:disabled {
        cursor: default;
        pointer-events: none;
        color: rgb(128, 128, 128);
        background-color: transparent !important;
        font-weight: 400 !important;
      }

      ul button.active {
        background-color: rgb(153, 153, 153);
        font-weight: 700;
      }

      .error {
        height: 100%;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
      }

      .computed-head {
        font-weight: 700;
      }

      .detail-head {
        border-bottom: 1px solid rgb(151, 151, 151);
        position: sticky;
        top: 0;
        margin: 0;
        padding: 0 1rem 8px;
        width: 100%;
        margin-left: -1rem;
        background: rgb(48, 48, 48);
        display: flex;
        justify-content: space-between;
      }

      .detail-head p {
        margin: 0;
      }

      .detail-head button {
        all: unset;
        text-decoration: underline;
        cursor: pointer;
      }

      .detail-head button + button {
        margin-left: 10px;
      }

      th {
        text-align-last: left;
        padding-right: 1rem;
        font-weight: 400;
      }

      table {
        border-collapse: collapse;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class StoreDebugComponent implements OnDestroy {
  @Input()
  store?: MappedEntityState<any>;

  uiState: UiState = 'overview';

  uniqueId = UNIQUE_ID;

  private _destroy$ = new Subject<boolean>();

  ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

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

  startPolling() {
    this.store?.startPolling({
      intervalDuration: 2500,
      killSwitch: this._destroy$,
    });
  }

  stopPolling() {
    this.store?.stopPolling();
  }
}
