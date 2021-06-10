import { Component, OnInit } from '@angular/core';
import {
  MappedEntityState,
  isAction,
} from 'projects/ngrx-toolkit/src/public-api';
import { tap } from 'rxjs/operators';
import { getFoo, postSandbox } from './store/sandbox.actions';
import { SandboxFacade } from './store/sandbox.facade';

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
    this.store = this._sandboxFacade.postSandbox({
      body: { foo: '' },
      params: { foo: '' },
      queryParams: { foo: '' },
    });

    this._sandboxFacade.postSandbox({
      body: { foo: 'bar' },
      params: { foo: 'bar' },
      queryParams: { foo: 'bar' },
    });

    this._sandboxFacade.postSandbox({
      body: { foo: 'baz' },
      params: { foo: 'baz' },
      queryParams: { foo: 'baz' },
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
