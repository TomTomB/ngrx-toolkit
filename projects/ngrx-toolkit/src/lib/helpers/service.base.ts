import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  HttpCallOptions,
  HttpDeleteOptions,
  HttpGetOptions,
  HttpPatchOptions,
  HttpPostOptions,
  HttpPutOptions,
} from '../types';
import { generateEntityId } from './util';

interface CacheItem {
  validUntil: number;
  data: any;
}

export const defineResponseType = <T extends any>() => null as any as T;

// TODO (TRB): Add _baseConfig strategy (fallback or merge), default = fallback
export class ServiceBase {
  private _cache: Record<number, CacheItem> = {};

  constructor(
    private __http: HttpClient,
    private _apiBase: string,
    private _baseConfig?: HttpCallOptions
  ) {}

  get<
    HttpOpts extends HttpGetOptions,
    ResponseType extends ReturnType<typeof defineResponseType> = ReturnType<
      typeof defineResponseType
    >
  >({
    apiRoute,
    httpOpts,
    extras,
  }: {
    apiRoute: HttpOpts['queryParams'] extends object
      ? (queryParams: HttpOpts['queryParams']) => string
      : string;
    responseType: ResponseType;
    httpOpts?: HttpOpts;
    extras?: {
      apiBaseOverride?: string;
      cacheExpiresIn?: number;
      skipCache?: boolean;
    };
  }) {
    const route =
      typeof apiRoute === 'string' ? apiRoute : apiRoute(httpOpts?.queryParams);

    let cacheIdParams = 'NO_ARG' + JSON.stringify({ httpOpts, route, extras });

    const { apiBase, headers, params, responseType } = this._getCallConfig(
      httpOpts,
      extras
    );

    const cacheId = generateEntityId(cacheIdParams);
    const cacheItem = this._cache[cacheId];

    if (cacheItem) {
      if (new Date().getTime() < cacheItem.validUntil && !extras?.skipCache) {
        return of(cacheItem.data) as Observable<ResponseType>;
      } else {
        delete this._cache[cacheId];
      }
    }

    return this.__http
      .get<ResponseType>(`${apiBase}${route}`, {
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
            return { file: r.body } as any as ResponseType;
          }
          return r.body as ResponseType;
        })
      );
  }

  post<
    HttpOpts extends HttpPostOptions,
    ResponseType extends ReturnType<typeof defineResponseType> = ReturnType<
      typeof defineResponseType
    >
  >({
    apiRoute,
    httpOpts,
    extras,
  }: {
    apiRoute: HttpOpts['queryParams'] extends object
      ? (queryParams: HttpOpts['queryParams']) => string
      : string;
    responseType: ResponseType;
    httpOpts?: HttpOpts;
    extras?: {
      apiBaseOverride?: string;
    };
  }) {
    const route =
      typeof apiRoute === 'string' ? apiRoute : apiRoute(httpOpts?.queryParams);

    const { apiBase, headers, params, responseType } = this._getCallConfig(
      httpOpts,
      extras
    );

    return this.__http
      .post<ResponseType>(`${apiBase}${route}`, httpOpts?.body, {
        headers: headers,
        params: params as any,
        responseType: responseType as any,
      })
      .pipe(
        map((r) => {
          if (responseType === 'arraybuffer') {
            return { file: r } as any as ResponseType;
          }
          return r;
        })
      );
  }

  put<
    HttpOpts extends HttpPutOptions,
    ResponseType extends ReturnType<typeof defineResponseType> = ReturnType<
      typeof defineResponseType
    >
  >({
    apiRoute,
    httpOpts,
    extras,
  }: {
    apiRoute: HttpOpts['queryParams'] extends object
      ? (queryParams: HttpOpts['queryParams']) => string
      : string;
    responseType: ResponseType;
    httpOpts?: HttpOpts;
    extras?: {
      apiBaseOverride?: string;
    };
  }) {
    const route =
      typeof apiRoute === 'string' ? apiRoute : apiRoute(httpOpts?.queryParams);

    const { apiBase, headers, params, responseType } = this._getCallConfig(
      httpOpts,
      extras
    );

    return this.__http
      .put<ResponseType>(`${apiBase}${route}`, httpOpts?.body, {
        headers: headers,
        params: params as any,
        responseType: responseType as any,
      })
      .pipe(
        map((r) => {
          if (responseType === 'arraybuffer') {
            return { file: r } as any as ResponseType;
          }
          return r;
        })
      );
  }

  patch<
    HttpOpts extends HttpPatchOptions,
    ResponseType extends ReturnType<typeof defineResponseType> = ReturnType<
      typeof defineResponseType
    >
  >({
    apiRoute,
    httpOpts,
    extras,
  }: {
    apiRoute: HttpOpts['queryParams'] extends object
      ? (queryParams: HttpOpts['queryParams']) => string
      : string;
    responseType: ResponseType;
    httpOpts?: HttpOpts;
    extras?: {
      apiBaseOverride?: string;
    };
  }) {
    const route =
      typeof apiRoute === 'string' ? apiRoute : apiRoute(httpOpts?.queryParams);

    const { apiBase, headers, params, responseType } = this._getCallConfig(
      httpOpts,
      extras
    );

    return this.__http
      .patch<ResponseType>(`${apiBase}${route}`, httpOpts?.body, {
        headers: headers,
        params: params as any,
        responseType: responseType as any,
      })
      .pipe(
        map((r) => {
          if (responseType === 'arraybuffer') {
            return { file: r } as any as ResponseType;
          }
          return r;
        })
      );
  }

  delete<
    HttpOpts extends HttpDeleteOptions,
    ResponseType extends ReturnType<typeof defineResponseType> = ReturnType<
      typeof defineResponseType
    >
  >({
    apiRoute,
    httpOpts,
    extras,
  }: {
    apiRoute: HttpOpts['queryParams'] extends object
      ? (queryParams: HttpOpts['queryParams']) => string
      : string;
    responseType: ResponseType;
    httpOpts?: HttpOpts;
    extras?: {
      apiBaseOverride?: string;
    };
  }) {
    const route =
      typeof apiRoute === 'string' ? apiRoute : apiRoute(httpOpts?.queryParams);

    const { apiBase, headers, params, responseType } = this._getCallConfig(
      httpOpts,
      extras
    );

    return this.__http
      .delete<ResponseType>(`${apiBase}${route}`, {
        headers: headers,
        params: params as any,
        responseType: responseType as any,
      })
      .pipe(
        map((r) => {
          if (responseType === 'arraybuffer') {
            return { file: r } as any as ResponseType;
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
