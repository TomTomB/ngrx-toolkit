import { MappedEntityState, TypedActionObject } from '../types';
import { Actions, ofType } from '@ngrx/effects';
import { Action, ActionCreator, Store } from '@ngrx/store';
import {
  Observable,
  Subject,
  interval,
  BehaviorSubject,
  Subscription,
} from 'rxjs';
import { filter, take, takeUntil, tap } from 'rxjs/operators';
import { EntitySelectors } from './selector.helpers';
import { removeCallState } from './action.helpers';
import { createActionId } from './util';

export class FacadeBase {
  private _cache: Record<string, MappedEntityState<any>> = {};

  constructor(
    private __store: Store<Record<any,any>>,
    private __actions: Actions,
    private _entitySelectors: EntitySelectors
  ) {}

  /**
   * Listen to actions provided by this store
   * @param actions The actions to listen on
   * @example
   * const getAllKittens = createAction(
   *  'Get all kittens'
   * );
   *
   * const getAllDogs = createAction(
   *  'Get all dogs'
   * );
   *
   * // Pass in the action
   * on([getAllKittens, getAllDogs]);
   * // OR
   * on(getAllKittens);
   */
  on<J extends ActionCreator>(actions: J): Observable<ReturnType<J>>;
  on<J extends ActionCreator[]>(actions: J): Observable<ReturnType<J[number]>>;
  on(actions: any): Observable<any> | undefined {
    if (Array.isArray(actions)) {
      const _actions = actions as ActionCreator[];
      return this.__actions.pipe(ofType(..._actions.map((a) => a.type)));
    }
    if (typeof actions === 'function') {
      const _action = actions as ActionCreator;
      return this.__actions.pipe(ofType(_action.type));
    }
    return;
  }

  /**
   * Listen to actions provided by this store once
   * @param actions The actions to listen on
   * @example
   * const getAllKittens = createAction(
   *  'Get all kittens'
   * );
   *
   * const getAllDogs = createAction(
   *  'Get all dogs'
   * );
   *
   * // Pass in the action
   * once([getAllKittens, getAllDogs]);
   * // OR
   * once(getAllKittens);
   */
  once<J extends ActionCreator>(actions: J): Observable<ReturnType<J>>;
  once<J extends ActionCreator[]>(
    actions: J
  ): Observable<ReturnType<J[number]>>;
  once(actions: any): Observable<any> | undefined {
    return this.on(actions).pipe(take(1));
  }

  /**
   * Returns all states associated to a action object
   * Also includes useful helper methods
   */
  select<J extends TypedActionObject>(
    selector: J,
    actionId: number
  ): MappedEntityState<J> {
    const cacheId = `${selector.call.type}_${actionId}`;
    if (this._cache[cacheId]) {
      return this._cache[cacheId];
    }

    const response$ = this.selectResponse<J>(selector, actionId);
    const cachedResponse$ = this.selectCachedResponse<J>(selector, actionId);

    const error$ = this.selectError<J>(selector, actionId);
    const args$ = this.selectArgs<J>(selector, actionId);

    const isInit$ = this.selectIsInit(selector, actionId);
    const isLoading$ = this.selectIsLoading(selector, actionId);
    const isSuccess$ = this.selectIsSuccess(selector, actionId);
    const isError$ = this.selectIsError(selector, actionId);

    const type$ = this.selectType(selector, actionId);
    const timestamp$ = this.selectTimestamp(selector, actionId);
    const entityId$ = this.selectEntityId(selector, actionId);
    const callState$ = this.selectCallState(selector, actionId);

    const isPolling$ = new BehaviorSubject<boolean>(false);

    const refresh = () =>
      args$
        .pipe(
          take(1),
          tap((args) => this._dispatch(selector.call({ args })))
        )
        .subscribe();

    const remove = () => {
      stopPolling();
      this.remove(selector, actionId);
    };

    let killSwitchSub = Subscription.EMPTY;
    let pollSub = Subscription.EMPTY;

    const startPolling = ({
      intervalDuration,
      killSwitch,
    }: {
      intervalDuration: number;
      killSwitch: Subject<boolean>;
    }) => {
      if (isPolling$.value) {
        return;
      }

      killSwitchSub = killSwitch
        .pipe(
          take(1),
          tap(() => isPolling$.next(false))
        )
        .subscribe();

      isPolling$.next(true);

      pollSub = interval(intervalDuration)
        .pipe(
          tap(() => refresh()),
          takeUntil(killSwitch)
        )
        .subscribe();
    };

    const stopPolling = () => {
      killSwitchSub?.unsubscribe();
      pollSub?.unsubscribe();
      isPolling$.next(false);
    };

    const mappedEntityState = {
      response$,
      cachedResponse$,
      error$,
      args$,
      isInit$,
      isLoading$,
      isSuccess$,
      isError$,
      isPolling$,
      type$,
      timestamp$,
      entityId$,
      callState$,
      refresh,
      remove,
      startPolling,
      stopPolling,
    };

    this._cache[cacheId] = mappedEntityState;

    return mappedEntityState;
  }

  selectIsInit<J extends TypedActionObject>(selector: J, actionId: number) {
    return this.__store.select(
      this._entitySelectors.getIsInit(selector.entityId, actionId)
    );
  }

  selectIsLoading<J extends TypedActionObject>(selector: J, actionId: number) {
    return this.__store.select(
      this._entitySelectors.getIsLoading(selector.entityId, actionId)
    );
  }

  selectIsSuccess<J extends TypedActionObject>(selector: J, actionId: number) {
    return this.__store.select(
      this._entitySelectors.getIsSuccess(selector.entityId, actionId)
    );
  }

  selectIsError<J extends TypedActionObject>(selector: J, actionId: number) {
    return this.__store.select(
      this._entitySelectors.getIsError(selector.entityId, actionId)
    );
  }

  selectResponse<J extends TypedActionObject>(
    selector: J,
    actionId: number
  ): Observable<ReturnType<J['success']>['response'] | null> {
    return this.__store.select(
      this._entitySelectors.getResponse(selector.entityId, actionId)
    );
  }

  selectCachedResponse<J extends TypedActionObject>(
    selector: J,
    actionId: number
  ): Observable<ReturnType<J['success']>['response']> {
    return this.__store
      .select(this._entitySelectors.getResponse(selector.entityId, actionId))
      .pipe(filter((v): v is ReturnType<J['success']>['response'] => !!v));
  }

  selectError<J extends TypedActionObject>(
    selector: J,
    actionId: number
  ): Observable<ReturnType<J['failure']>['error'] | null> {
    return this.__store.select(
      this._entitySelectors.getError(selector.entityId, actionId)
    );
  }

  selectArgs<J extends TypedActionObject>(
    selector: J,
    actionId: number
  ): Observable<ReturnType<J['call']>['args']> {
    return this.__store.select(
      this._entitySelectors.getArgs(selector.entityId, actionId)
    );
  }

  selectEntityId<J extends TypedActionObject>(selector: J, actionId: number) {
    return this.__store.select(
      this._entitySelectors.getEntityId(selector.entityId, actionId)
    );
  }

  selectTimestamp<J extends TypedActionObject>(selector: J, actionId: number) {
    return this.__store.select(
      this._entitySelectors.getTimestamp(selector.entityId, actionId)
    );
  }

  selectType<J extends TypedActionObject>(selector: J, actionId: number) {
    return this.__store.select(
      this._entitySelectors.getType(selector.entityId, actionId)
    );
  }

  selectCallState<J extends TypedActionObject>(selector: J, actionId: number) {
    return this.__store.select(
      this._entitySelectors.getCallState(selector.entityId, actionId)
    );
  }

  /**
   * Remove an item from the store
   * @param selector The store item key. This should be an action
   * @example
   * const getAllKittens = createAction(
   *  'Get all kittens'
   * );
   *
   * // Pass in the action
   * remove(getAllKittens);
   */
  remove<J extends TypedActionObject>(selector: J, actionId: number) {
    this._dispatch(
      removeCallState({
        adapterId: selector.entityId,
        actionId: actionId,
      })
    );
  }

  /**
   * Dispatch a call action to the store
   * @param actionGroup The group to dispatch the call action of
   * @param args The call action args
   * @returns A mapped entity state
   */
  call<J extends TypedActionObject>(
    actionGroup: J,
    args: ReturnType<J['call']>['args']
  ) {
    return this.select(
      actionGroup,
      this._dispatch(actionGroup.call({ args }), actionGroup.isUnique)
    );
  }

  /**
   * @param action The action to dispatch
   */
  private _dispatch(action: Action, isUnique?: boolean) {
    const id = createActionId(action, isUnique);
    this.__store.dispatch(action);
    return id;
  }
}
