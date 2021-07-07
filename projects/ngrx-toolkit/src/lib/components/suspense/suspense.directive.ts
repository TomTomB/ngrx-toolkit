import {
  ChangeDetectorRef,
  Directive,
  Input,
  NgZone,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { ObservableInput, Observer, Unsubscribable } from 'rxjs';
import { NextObserver } from 'rxjs';
import { CdAware, createCdAware, createRender } from './util';

export class SuspenseViewContext<T = unknown> {
  // @ts-ignore
  $implicit: T = null;
  // @ts-ignore
  ngrxtSuspense: T = null;
  $error = false;
  $complete = false;
}

@Directive({
  selector: '[ngrxtSuspense]',
})
export class SuspenseDirective<U> implements OnDestroy {
  static ngTemplateGuard_ngrxToolkitSuspense: 'binding';

  private _embeddedView: any;

  private readonly _viewContext = new SuspenseViewContext();

  private readonly _subscription: Unsubscribable;
  private readonly _cdAware: CdAware<U | null | undefined>;
  private readonly _resetContextObserver: NextObserver<void> = {
    next: () => {
      if (this._embeddedView) {
        this._viewContext.$implicit = undefined;
        this._viewContext.ngrxtSuspense = undefined;
        this._viewContext.$error = false;
        this._viewContext.$complete = false;
      }
    },
  };
  private readonly _updateViewContextObserver: Observer<U | null | undefined> =
    {
      next: (value: U | null | undefined) => {
        if (!this._embeddedView) {
          this.createEmbeddedView();
        }
        this._viewContext.$implicit = value;
        this._viewContext.ngrxtSuspense = value;
      },
      error: (error: Error) => {
        if (!this._embeddedView) {
          this.createEmbeddedView();
        }
        this._viewContext.$error = true;
      },
      complete: () => {
        if (!this._embeddedView) {
          this.createEmbeddedView();
        }
        this._viewContext.$complete = true;
      },
    };

  @Input()
  set ngrxtSuspense(
    potentialObservable: ObservableInput<U> | null | undefined
  ) {
    this._cdAware.nextPotentialObservable(potentialObservable);
  }

  constructor(
    cdRef: ChangeDetectorRef,
    ngZone: NgZone,
    private readonly templateRef: TemplateRef<SuspenseViewContext<U>>,
    private readonly viewContainerRef: ViewContainerRef
  ) {
    this._cdAware = createCdAware<U>({
      render: createRender({ cdRef, ngZone }),
      resetContextObserver: this._resetContextObserver,
      updateViewContextObserver: this._updateViewContextObserver,
    });
    this._subscription = this._cdAware.subscribe();
  }

  static ngTemplateContextGuard<U>(
    dir: SuspenseDirective<U>,
    ctx: unknown | null | undefined
  ): ctx is SuspenseViewContext<U> {
    return true;
  }

  createEmbeddedView() {
    this._embeddedView = this.viewContainerRef.createEmbeddedView(
      this.templateRef,
      this._viewContext
    );
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
