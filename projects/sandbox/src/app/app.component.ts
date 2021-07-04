import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  MappedEntityState,
  isAction,
} from '../../../ngrx-toolkit/src/public-api';
import { tap } from 'rxjs/operators';
import { getBar, getFoo, postSandbox } from './store/sandbox.actions';
import { SandboxFacade } from './store/sandbox.facade';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  title = 'sandbox';

  store!: MappedEntityState<typeof postSandbox>;
  store2?: MappedEntityState<typeof getFoo>;
  store3?: MappedEntityState<typeof getBar>;

  constructor(private _sandboxFacade: SandboxFacade) {}

  ngOnInit(): void {
    this._sandboxFacade.getBar({
      queryParams: { barSlug: 'test', barId: 'test' },
      params: { page: 5 },
    });

    this.store3 = this._sandboxFacade.getBar({
      queryParams: { barSlug: 'baro', barId: 'abc123' },
      params: { page: 1 },
    });

    this.store2 = this._sandboxFacade.getFoo({
      queryParams: { sandboxSlug: 'foobar' },
    });

    this.store = this._sandboxFacade.postSandbox({
      queryParams: { sandboxId: 'asfs11412vad' },
      sideUpdates: {
        getFoo: { queryParams: { sandboxSlug: 'foobar' } },
        getBar: {
          params: { page: 1 },
          queryParams: { barId: 'abc123', barSlug: 'baro' },
        },
      },
    });

    const onExample = this._sandboxFacade.on(postSandbox.success);

    const onExampleMulti = this._sandboxFacade
      .on([postSandbox.success, postSandbox.failure])
      .pipe(
        tap((a) => {
          if (isAction(postSandbox.success, a)) {
            console.log('onExampleMulti', a);
          }
        })
      )
      .subscribe();

    const onceExample = this._sandboxFacade.once(postSandbox.success);

    const onceExampleMulti = this._sandboxFacade.once([
      postSandbox.success,
      postSandbox.failure,
    ]);
  }

  getBar() {
    this._sandboxFacade.getBar({
      queryParams: { barSlug: 'baro', barId: 'abc123' },
      params: { page: 1 },
    });
  }
}
