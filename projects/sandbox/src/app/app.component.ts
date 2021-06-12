import { Component, OnInit } from '@angular/core';
import {
  MappedEntityState,
  isAction,
} from 'projects/ngrx-toolkit/src/public-api';
import { tap } from 'rxjs/operators';
import { getFoo, postSandbox } from './store/sandbox.actions';
import { SandboxFacade } from './store/sandbox.facade';

const dumbSideUpdates = {
  failure: [] as any,
  success: [] as any,
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'sandbox';

  store!: MappedEntityState<typeof postSandbox>;
  store2?: MappedEntityState<typeof getFoo>;

  constructor(private _sandboxFacade: SandboxFacade) {}

  ngOnInit(): void {
    this.store2 = this._sandboxFacade.call(getFoo, {
      queryParams: { sandboxSlug: 'foobar' },
      sideUpdates: dumbSideUpdates,
    });

    this.store = this._sandboxFacade.call(postSandbox, {
      queryParams: { sandboxId: 'asfs11412vad' },
      sideUpdates: {
        success: [
          {
            queryParams: { sandboxSlug: 'foobar' },
            sideUpdates: dumbSideUpdates,
          },
          {
            queryParams: {
              barSlug: 'dsfdf',
            },
            params: {
              page: 1,
            },
            sideUpdates: dumbSideUpdates,
          },
        ],
        failure: [
          {
            queryParams: { sandboxSlug: 'foobar' },
            sideUpdates: dumbSideUpdates,
          },
        ],
      },
    });

    const onExample = this._sandboxFacade.on(postSandbox.success);

    const onExampleMulti = this._sandboxFacade
      .on([postSandbox.success, postSandbox.failure])
      .pipe(
        tap((a) => {
          if (isAction(postSandbox.success, a)) {
            console.log('yes', a);
          }
        })
      )
      .subscribe();

    const onceExample = this._sandboxFacade.on(postSandbox.success);

    const onceExampleMulti = this._sandboxFacade.on([
      postSandbox.success,
      postSandbox.failure,
    ]);
  }
}
