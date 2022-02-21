import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  MappedEntityState,
  isAction,
} from '../../../ngrx-toolkit/src/public-api';
import { tap } from 'rxjs/operators';
import { SandboxFacade } from './store/sandbox.facade';
import { actionMap } from './store/sandbox.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  title = 'sandbox';

  store!: MappedEntityState<typeof actionMap['postSandbox']>;
  store2?: MappedEntityState<typeof actionMap['getFoo']>;
  store3?: MappedEntityState<typeof actionMap['getBar']>;
  store4?: MappedEntityState<typeof actionMap['getBar']>;

  constructor(
    private _sandboxFacade: SandboxFacade,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._sandboxFacade.dispatch.getBar({
      params: { someFilter: '5', barIds: ['a', 'b', 'c'] },
      actionOptions: { headers: { Foo: 'true' }, extras: { skipCache: true } },
    });

    this.assignStore3();

    this.store2 = this._sandboxFacade.dispatch.getFoo({
      queryParams: { sandboxSlug: 'foobar' },
    });

    this.store = this._sandboxFacade.dispatch.postSandbox({
      queryParams: { sandboxId: '1', sandboxTest: 1 },
      sideUpdates: {
        getFoo: { queryParams: { sandboxSlug: 'foobar' } },
        getBar: {
          params: { someFilter: '1', barIds: ['a', 'b', 'c'] },
        },
      },
    });

    const onExample = this._sandboxFacade.on(actionMap.postSandbox.success);

    const onExampleMulti = this._sandboxFacade
      .on([actionMap.postSandbox.success, actionMap.postSandbox.failure])
      .pipe(
        tap((a) => {
          if (isAction(actionMap.postSandbox.success, a)) {
            console.log('onExampleMulti', a);
          }
        })
      )
      .subscribe();

    const onceExample = this._sandboxFacade.once(actionMap.postSandbox.success);

    const onceExampleMulti = this._sandboxFacade.once([
      actionMap.postSandbox.success,
      actionMap.postSandbox.failure,
    ]);
  }

  assignStore3() {
    this.store3 = this._sandboxFacade.dispatch.getBar({
      params: { someFilter: '1', barIds: ['a', 'b', 'c'] },
    });
  }

  assignStore4() {
    this.store4 = this._sandboxFacade.dispatch.getBar({
      params: { someFilter: '1', barIds: ['a', 'b', 'c'] },
    });
    this._cdr.markForCheck();
  }

  benchmarkAllSame() {
    console.log('running benchmarkAllSame... (5000 samples)');

    // eslint-disable-next-line no-restricted-syntax
    console.time('benchmarkAllSame');

    for (let i = 0; i < 5000; i++) {
      this._sandboxFacade.dispatch.benchmark({
        queryParams: { benchmark: 'abc123' },
      });
    }

    // eslint-disable-next-line no-restricted-syntax
    console.timeEnd('benchmarkAllSame');
  }

  benchmarkAllNew() {
    console.log('running benchmarkAllNew... (5000 samples)');

    // eslint-disable-next-line no-restricted-syntax
    console.time('benchmarkAllNew');

    for (let i = 0; i < 5000; i++) {
      this._sandboxFacade.dispatch.benchmark({
        queryParams: { benchmark: 'abc123' + i },
      });
    }

    // eslint-disable-next-line no-restricted-syntax
    console.timeEnd('benchmarkAllNew');
  }
}
