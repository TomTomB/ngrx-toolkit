import { TypedActionObject } from './types';

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type LastOf<T> = UnionToIntersection<
  T extends any ? () => T : never
> extends () => infer R
  ? R
  : never;

export type Push<T extends any[], V> = [...T, V];

export type UnionToTuple<
  T,
  L = LastOf<T>,
  N = [T] extends [never] ? true : false
> = true extends N ? [] : Push<UnionToTuple<Exclude<T, L>>, L>;

export type TupleArgs<
  T extends readonly TypedActionObject[] = readonly TypedActionObject[]
> = UnionToTuple<ReturnType<T[number]['call']>['args']>;

export type SideUpdates<
  Success extends readonly TypedActionObject[] = readonly TypedActionObject[],
  Failure extends readonly TypedActionObject[] = readonly TypedActionObject[]
> = {
  sideUpdates: {
    success: TupleArgs<Success>;
    failure: TupleArgs<Failure>;
  };
};
