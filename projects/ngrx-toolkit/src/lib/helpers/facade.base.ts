import { MappedEntityState, TypedActionObject } from '../types';
import { Actions, ofType } from '@ngrx/effects';
import { Action, ActionCreator, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import {
  EntitySelectors,
  generateEntityId,
  removeCallState,
} from './callstate.helpers';
import { uniformActionType } from './status.helpers';

export class FacadeBase {
  constructor(
    private __store: Store,
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
  on<J extends Action>(
    actions: ActionCreator
  ): Observable<ReturnType<typeof actions>>;
  on<J extends Action>(actions: ActionCreator[]): Observable<J>;
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
  once<J extends Action>(
    actions: ActionCreator
  ): Observable<ReturnType<typeof actions>>;
  once<J extends Action>(actions: ActionCreator[]): Observable<J>;
  once(actions: any): Observable<any> | undefined {
    if (Array.isArray(actions)) {
      const _actions = actions as ActionCreator[];
      return this.__actions.pipe(
        ofType(..._actions.map((a) => a.type)),
        take(1)
      );
    }
    if (typeof actions === 'function') {
      const _action = actions as ActionCreator;

      return this.__actions.pipe(ofType(_action.type), take(1));
    }
    return;
  }

  /**
   * Returns all states associated to a action object
   */
  select<J extends TypedActionObject>(
    selector: J,
    actionId: number
  ): MappedEntityState<J> {
    return {
      response$: this.selectResponse<J>(selector, actionId),
      truthyResponse$: this.selectTruthyResponse<J>(selector, actionId),
      falsyResponse$: this.selectFalsyResponse(selector, actionId),

      error$: this.selectError<J>(selector, actionId),
      args$: this.selectArgs<J>(selector, actionId),

      isInit$: this.selectIsInit(selector, actionId),
      isLoading$: this.selectIsLoading(selector, actionId),
      isSuccess$: this.selectIsSuccess(selector, actionId),
      isError$: this.selectIsError(selector, actionId),

      type$: this.selectType(selector, actionId),
      timestamp$: this.selectTimestamp(selector, actionId),
      entityId$: this.selectEntityId(selector, actionId),
      callState$: this.selectCallState(selector, actionId),
    };
  }

  selectIsInit<J extends TypedActionObject>(selector: J, actionId: number) {
    return this.__store.select(
      this._entitySelectors.getIsInit(
        uniformActionType(selector.call.type),
        actionId
      )
    );
  }

  selectIsLoading<J extends TypedActionObject>(selector: J, actionId: number) {
    return this.__store.select(
      this._entitySelectors.getIsLoading(
        uniformActionType(selector.call.type),
        actionId
      )
    );
  }

  selectIsSuccess<J extends TypedActionObject>(selector: J, actionId: number) {
    return this.__store.select(
      this._entitySelectors.getIsSuccess(
        uniformActionType(selector.call.type),
        actionId
      )
    );
  }

  selectIsError<J extends TypedActionObject>(selector: J, actionId: number) {
    return this.__store.select(
      this._entitySelectors.getIsError(
        uniformActionType(selector.call.type),
        actionId
      )
    );
  }

  selectResponse<J extends TypedActionObject>(
    selector: J,
    actionId: number
  ): Observable<ReturnType<J['success']>['response'] | null> {
    return this.__store.select(
      this._entitySelectors.getResponse(
        uniformActionType(selector.call.type),
        actionId
      )
    );
  }

  selectTruthyResponse<J extends TypedActionObject>(
    selector: J,
    actionId: number
  ): Observable<ReturnType<J['success']>['response']> {
    return this.__store
      .select(
        this._entitySelectors.getResponse(
          uniformActionType(selector.call.type),
          actionId
        )
      )
      .pipe(filter((v): v is ReturnType<J['success']>['response'] => !!v));
  }

  selectFalsyResponse<J extends TypedActionObject>(
    selector: J,
    actionId: number
  ): Observable<null> {
    return this.__store
      .select(
        this._entitySelectors.getResponse(
          uniformActionType(selector.call.type),
          actionId
        )
      )
      .pipe(filter((v): v is null => !v));
  }

  selectError<J extends TypedActionObject>(
    selector: J,
    actionId: number
  ): Observable<ReturnType<J['failure']>['error'] | null> {
    return this.__store.select(
      this._entitySelectors.getError(
        uniformActionType(selector.call.type),
        actionId
      )
    );
  }

  selectArgs<J extends TypedActionObject>(
    selector: J,
    actionId: number
  ): Observable<ReturnType<J['call']>['args']> {
    return this.__store.select(
      this._entitySelectors.getArgs(
        uniformActionType(selector.call.type),
        actionId
      )
    );
  }

  selectEntityId<J extends TypedActionObject>(selector: J, actionId: number) {
    return this.__store.select(
      this._entitySelectors.getEntityId(
        uniformActionType(selector.call.type),
        actionId
      )
    );
  }

  selectTimestamp<J extends TypedActionObject>(selector: J, actionId: number) {
    return this.__store.select(
      this._entitySelectors.getTimestamp(
        uniformActionType(selector.call.type),
        actionId
      )
    );
  }

  selectType<J extends TypedActionObject>(selector: J, actionId: number) {
    return this.__store.select(
      this._entitySelectors.getType(
        uniformActionType(selector.call.type),
        actionId
      )
    );
  }

  selectCallState<J extends TypedActionObject>(selector: J, actionId: number) {
    return this.__store.select(
      this._entitySelectors.getCallState(
        uniformActionType(selector.call.type),
        actionId
      )
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
    const _selector = selector as TypedActionObject;
    this._dispatch(
      removeCallState({
        adapterId: uniformActionType(_selector.call.type),
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
    return this.select(actionGroup, this._dispatch(actionGroup.call({ args })));
  }

  /**
   * @private DO NOT USE OUTSIDE OF FACADES
   * @param action The action to dispatch
   * @deprecated Will be private in the near future. Use `call()` instead
   */
  _dispatch(action: Action) {
    this.__store.dispatch(action);

    const args = (action as any).args;
    if (args) {
      const copiedArgs = JSON.parse(JSON.stringify(args));
      if (copiedArgs?.body?.password) {
        copiedArgs.body.password = '[HIDDEN]';
      }

      if (copiedArgs?.body?.plainPassword) {
        copiedArgs.body.plainPassword = '[HIDDEN]';
      }

      return generateEntityId(copiedArgs);
    }

    return generateEntityId(null);
  }
}
