import { Observable } from 'rxjs';
import { MappedEntityState, TypedActionObject } from '../types';

export type ExtractFrom<P> = P extends Observable<infer T> ? T : never;

export type State<
  T extends MappedEntityState<TypedActionObject> | null | undefined
> = T extends object
  ? {
      args: ExtractFrom<T['args$']>;
      cachedResponse: ExtractFrom<T['cachedResponse$']> | null;
      callState: ExtractFrom<T['callState$']>;
      entityId: ExtractFrom<T['entityId$']>;
      error: ExtractFrom<T['error$']>;
      isError: ExtractFrom<T['isError$']>;
      isInit: ExtractFrom<T['isInit$']>;
      isLoading: ExtractFrom<T['isLoading$']>;
      isPolling: ExtractFrom<T['isPolling$']>;
      isSuccess: ExtractFrom<T['isSuccess$']>;
      response: ExtractFrom<T['response$']>;
      timestamp: ExtractFrom<T['timestamp$']>;
      type: ExtractFrom<T['type$']>;
      refresh: () => void;
      remove: () => void;
    }
  : T;
