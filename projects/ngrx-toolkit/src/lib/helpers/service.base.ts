import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { buildApiURL } from './url-builder.helpers';
import { generateEntityId } from './callstate.helpers';
import {
  HttpCallOptions,
  HttpDeleteOptions,
  HttpGetOptions,
  HttpPatchOptions,
  HttpPostOptions,
  HttpPutOptions,
} from '../types';

interface CacheItem {
  validUntil: number;
  data: any;
}

export class ServiceBase {
  private _cache: Record<number, CacheItem> = {};

  constructor(
    private __http: HttpClient,
    private _apiBase: string,
    private _baseConfig?: HttpCallOptions
  ) {}

  get<T>({
    apiRoute,
    httpOpts,
    extras,
  }: {
    apiRoute: string;
    httpOpts?: HttpGetOptions;
    extras?: {
      apiBaseOverride?: string;
      cacheExpiresIn?: number;
      skipCache?: boolean;
    };
  }) {
    let cacheIdParams =
      'NO_ARG' + JSON.stringify({ httpOpts, apiRoute, extras });

    const { apiBase, headers, params, queryParams, responseType } =
      this._getCallConfig(httpOpts, extras);

    const cacheId = generateEntityId(cacheIdParams);
    const cacheItem = this._cache[cacheId];

    if (cacheItem) {
      if (new Date().getTime() < cacheItem.validUntil && !extras?.skipCache) {
        return of(cacheItem.data) as Observable<T>;
      } else {
        delete this._cache[cacheId];
      }
    }

    return this.__http
      .get<T>(buildApiURL(apiBase, apiRoute, queryParams), {
        headers: headers,
        params: params as any,
        observe: 'response',
        responseType: responseType as any,
      })
      .pipe(
        tap((r) => {
          if (extras?.skipCache) {
            return;
          }

          const sMaxAgeMatch = r.headers
            .get('Cache-Control')
            ?.match(/s-maxage=(\d+)/);
          const maxAgeMatch = r.headers
            .get('Cache-Control')
            ?.match(/max-age=(\d+)/);

          if (
            (!sMaxAgeMatch || !sMaxAgeMatch[1]) &&
            (!maxAgeMatch || !maxAgeMatch[1]) &&
            !extras?.cacheExpiresIn
          ) {
            return;
          }

          const cacheTime =
            extras?.cacheExpiresIn ??
            (sMaxAgeMatch && sMaxAgeMatch[1]) ??
            (maxAgeMatch && maxAgeMatch[1]);

          if (!cacheTime) {
            return;
          }

          const newCacheItem: CacheItem = {
            data: responseType === 'arraybuffer' ? { file: r.body } : r.body,
            validUntil: new Date().getTime() + +cacheTime * 1000,
          };

          this._cache[cacheId] = newCacheItem;
        }),
        map((r) => {
          if (responseType === 'arraybuffer') {
            return { file: r.body } as any as T;
          }
          return r.body as T;
        })
      );
  }

  post<T>({
    apiRoute,
    httpOpts,
    extras,
  }: {
    apiRoute: string;
    httpOpts?: HttpPostOptions;
    extras?: {
      apiBaseOverride?: string;
    };
  }) {
    const { apiBase, headers, params, queryParams, responseType } =
      this._getCallConfig(httpOpts, extras);

    return this.__http
      .post<T>(buildApiURL(apiBase, apiRoute, queryParams), httpOpts?.body, {
        headers: headers,
        params: params as any,
        responseType: responseType as any,
      })
      .pipe(
        map((r) => {
          if (responseType === 'arraybuffer') {
            return { file: r } as any as T;
          }
          return r;
        })
      );
  }

  put<T>({
    apiRoute,
    httpOpts,
    extras,
  }: {
    apiRoute: string;
    httpOpts?: HttpPutOptions;
    extras?: {
      apiBaseOverride?: string;
    };
  }) {
    const { apiBase, headers, params, queryParams, responseType } =
      this._getCallConfig(httpOpts, extras);

    return this.__http
      .put<T>(buildApiURL(apiBase, apiRoute, queryParams), httpOpts?.body, {
        headers: headers,
        params: params as any,
        responseType: responseType as any,
      })
      .pipe(
        map((r) => {
          if (responseType === 'arraybuffer') {
            return { file: r } as any as T;
          }
          return r;
        })
      );
  }

  patch<T>({
    apiRoute,
    httpOpts,
    extras,
  }: {
    apiRoute: string;
    httpOpts?: HttpPatchOptions;
    extras?: {
      apiBaseOverride?: string;
    };
  }) {
    const { apiBase, headers, params, queryParams, responseType } =
      this._getCallConfig(httpOpts, extras);

    return this.__http
      .patch<T>(buildApiURL(apiBase, apiRoute, queryParams), httpOpts?.body, {
        headers: headers,
        params: params as any,
        responseType: responseType as any,
      })
      .pipe(
        map((r) => {
          if (responseType === 'arraybuffer') {
            return { file: r } as any as T;
          }
          return r;
        })
      );
  }

  delete<T>({
    apiRoute,
    httpOpts,
    extras,
  }: {
    apiRoute: string;
    httpOpts?: HttpDeleteOptions;
    extras?: {
      apiBaseOverride?: string;
    };
  }) {
    const { apiBase, headers, params, queryParams, responseType } =
      this._getCallConfig(httpOpts, extras);

    return this.__http
      .delete<T>(buildApiURL(apiBase, apiRoute, queryParams), {
        headers: headers,
        params: params as any,
        responseType: responseType as any,
      })
      .pipe(
        map((r) => {
          if (responseType === 'arraybuffer') {
            return { file: r } as any as T;
          }
          return r;
        })
      );
  }

  clearCache() {
    this._cache = {};
  }

  private _getCallConfig(
    httpOpts?: HttpCallOptions,
    extras?: { apiBaseOverride?: string }
  ) {
    const apiBase = extras?.apiBaseOverride || this._apiBase || '';
    const headers = httpOpts?.headers || this._baseConfig?.headers;
    const params = httpOpts?.params || this._baseConfig?.params;
    const queryParams = httpOpts?.queryParams || this._baseConfig?.queryParams;
    const responseType =
      httpOpts?.responseType || this._baseConfig?.responseType || 'json';

    return { apiBase, headers, params, queryParams, responseType };
  }
}
