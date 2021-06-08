import { Component, OnInit } from '@angular/core';
import { MappedEntityState } from 'projects/ngrx-toolkit/src/public-api';
import { postSandbox } from './store/sandbox.actions';
import { SandboxFacade } from './store/sandbox.facade';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'sandbox';

  store!: MappedEntityState<typeof postSandbox>;

  constructor(private _sandboxFacade: SandboxFacade) {}

  ngOnInit(): void {
    this.store = this._sandboxFacade.postSandbox({
      body: { foo: '' },
      params: { foo: '' },
      queryParams: { foo: '' },
    });

    this._sandboxFacade.postSandbox({
      body: { foo: 'afasf' },
      params: { foo: '' },
      queryParams: { foo: 'fsa' },
    });

    this._sandboxFacade.postSandbox({
      body: { foo: 'dsfdsf' },
      params: { foo: 'dsfsdf' },
      queryParams: { foo: '' },
    });
  }
}
