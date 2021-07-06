# NgRx Toolkit

> A bundle containing NgRx Helper classes and functions to simplify the coding experience

[![NPM version](https://img.shields.io/npm/v/@tomtomb/ngrx-toolkit)](https://www.npmjs.com/package/@tomtomb/ngrx-toolkit)
[![License](https://img.shields.io/github/license/tomtomb/ngrx-toolkit)](https://github.com/TomTomB/ngrx-toolkit/blob/main/LICENSE)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

## Installation

Requires Angular 12.1+

```bash
npm install @ngrx/{store,effects,entity} @tomtomb/ngrx-toolkit
# or
yarn add @ngrx/{store,effects,entity} @tomtomb/ngrx-toolkit
```

You probably want to install the store devtools as well

```bash
npm install -D @ngrx/store-devtools
# or
yarn add -D @ngrx/store-devtools
```

## Getting started

For a full example have a look at [the sandbox application](https://github.com/TomTomB/ngrx-toolkit/tree/main/projects/sandbox). The toolkit can easily be integrated into an existing NgRx store.

## API

# These docs are based on version prior to 2.x. The new version included many breaking changes, so please refer to the sandbox app for now!

### `createActionGroup<Arguments, ResponseData, ErrorResponse>({method, name, scope, isUnique})`

> Creates an action group containing a `call`, `success` and `failure` action.

#### Generics

| Generic       | Extends                | Description                                                                                                                    | Default   |
| ------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------ | --------- |
| Arguments     | `ArgumentsBase / null` | Arguments needed to perform the action                                                                                         |           |
| ResponseData  |                        | The response if the call was successfully performed                                                                            |           |
| ErrorResponse |                        | Additional error data returned by the [HttpErrorResponse](https://angular.io/api/common/http/HttpErrorResponse) error property | `unknown` |

**IMPORTANT:** The structure of the `Arguments` type must be based on the `ArgumentsBase` type.

```typescript
export interface ArgumentsBase {
  queryParams?: Record<string | number, unknown>;
  params?: Record<string | number, unknown>;
  body?: unknown;
  sideUpdates?: Record<string, ArgumentsBase>;
}
```

#### Arguments

| Argument | Type                                          | Description                                                                                                                                               | Default |
| -------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| method   | `'GET' / 'POST' / 'PUT' / 'PATCH' / 'DELETE'` | HTTP verb of the action                                                                                                                                   |         |
| name     | `string`                                      | The actions name                                                                                                                                          |         |
| scope    | `string`                                      | The actions scope                                                                                                                                         |         |
| isUnique | `boolean / undefined`                         | By default all action calls will be stored inside the store. If `true`, only one action call will be stored. This is useful for things like login actions | `false` |

#### Returns

`TypedActionObject<Arguments, ResponseData, ErrorResponse>`

#### Example

```typescript
export const getFoo = createActionGroup<
  { queryParams: { id: string } }, // This object must follow the ArgumentsBase type
  { value: boolean },
  { additionalErrorData: string }
>({
  method: 'GET',
  name: 'Foo',
  scope: 'Sandbox',
});
```

[View the sandbox code](https://github.com/TomTomB/ngrx-toolkit/blob/main/projects/sandbox/src/app/store/sandbox.actions.ts)

---

### `createStoreSlice({actions})`

> Creates an reducer based on provided TypedActionObjects.

WIP

[View the sandbox code](https://github.com/TomTomB/ngrx-toolkit/blob/main/projects/sandbox/src/app/store/sandbox.reducer.ts)

---

### `createEntitySelectors({getState, storeSlice})`

> Creates selector functions to be used by `FacadeBase`

WIP

[View the sandbox code](https://github.com/TomTomB/ngrx-toolkit/blob/main/projects/sandbox/src/app/store/sandbox.selectors.ts)

---

### `EffectBase` (class)

> A abstract class for handling ngrx effects with ActionGroups

### `constructor(actions, featureService)`

#### Arguments

| Argument       | Type      | Description                                                        | Default |
| -------------- | --------- | ------------------------------------------------------------------ | ------- |
| actions        | `Actions` | The NgRx [Actions](https://ngrx.io/api/effects/Actions) Observable |         |
| featureService | `class`   | The class where the actual http calls are located                  |         |

### `onActionSwitchMap(action, serviceCall, sideUpdates)`

### `onActionMergeMap(action, serviceCall, sideUpdates)`

### `onActionExhaustMap(action, serviceCall, sideUpdates)`

### `onActionConcatMap(action, serviceCall, sideUpdates)`

> These methods are all doing the same except for the used observable flattening operator. <br>

RxJS Docs: [switchMap](https://rxjs.dev/api/operators/switchMap), [mergeMap](https://rxjs.dev/api/operators/mergeMap), [exhaustMap](https://rxjs.dev/api/operators/exhaustMap), [concatMap](https://rxjs.dev/api/operators/concatMap)

#### Generics

Generics should **NOT** be provided by the user. They are filled automatically.

#### Arguments

| Argument    | Type                 | Description                                                                                                    | Default   |
| ----------- | -------------------- | -------------------------------------------------------------------------------------------------------------- | --------- |
| action      | `TypedActionObject`  | The action group created via `createActionGroup()`                                                             |           |
| serviceCall | `method`             | A reference to the actual http call                                                                            |           |
| sideUpdates | `object / undefined` | Additional user defined side effects. These actions will be called after the parent success action gets called | undefined |

#### Example

```typescript
@Injectable()
export class SandboxEffects extends EffectBase {
  getFoo$ = this.onActionSwitchMap({
    action: SandboxActions.getFoo,
    serviceCall: this.featureService.getFoo,
  });

  constructor(
    private actions$: Actions,
    private featureService: SandboxService
  ) {
    super(actions$, featureService);
  }
}
```

[View the sandbox code](https://github.com/TomTomB/ngrx-toolkit/blob/main/projects/sandbox/src/app/store/sandbox.effects.ts)

---

### `FacadeBase` (class)

> A abstract class for dispatching actions and retrieving data from the store

WIP

[View the sandbox code](https://github.com/TomTomB/ngrx-toolkit/blob/main/projects/sandbox/src/app/store/sandbox.facade.ts)

---

### `ServiceBase` (class)

> A abstract class for making http calls with caching built-in

WIP

[View the sandbox code](https://github.com/TomTomB/ngrx-toolkit/blob/main/projects/sandbox/src/app/store/sandbox.service.ts)

---
