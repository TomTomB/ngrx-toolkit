import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  ActionMethod,
  AnyTypedActionObject,
  HttpCallOptions,
  HttpDeleteOptions,
  HttpGetOptions,
  HttpPatchOptions,
  HttpPostOptions,
  HttpPutOptions,
} from '../types';
import { generateEntityId } from './util';
import { type IStringifyOptions, stringify } from '../qs';

interface CacheItem {
  validUntil: number;
  data: any;
}

const defineResponseType = <T extends any>() => null as any as T;

type ActionMap = Record<string, AnyTypedActionObject>;

export type ServiceCalls<T extends ActionMap> = {
  [Property in keyof T]: (
    args: ReturnType<T[Property]['call']>['args']
  ) => Observable<ReturnType<T[Property]['success']>['response']>;
};

export type CallConfigs<T extends ActionMap> = {
  [Property in keyof T]: {
    route: ExtractRoute<T[Property]>;
  };
};

export type ExtractRoute<T extends ActionMap[number]> = ReturnType<
  T['call']
>['args']['queryParams'] extends object
  ? (queryParams: ReturnType<T['call']>['args']['queryParams']) => string
  : string;

// TODO (TRB): Add _baseConfig strategy (fallback or merge), default = fallback
export class ServiceBase<T extends ActionMap> {
  private _cache: Record<number, CacheItem> = {};

  execute: ServiceCalls<T> = {} as ServiceCalls<T>;

  constructor(
    private _config: {
      http: HttpClient;
      actionMap: T;
      callConfig: CallConfigs<T>;
      baseConfig: HttpCallOptions & { apiBase: string };
    }
  ) {
    this._createServiceCalls(_config.callConfig);
  }

  private _createServiceCalls(callConfigs: CallConfigs<T>) {
    // TODO (TRB): Map config to service calls
    Object.keys(callConfigs).forEach((callName: keyof T) => {
      const config: CallConfigs<T>[keyof T] = callConfigs[callName];
      const action = this._config.actionMap[callName];

      switch (action.method as ActionMethod) {
        case 'GET':
          this.execute[callName] = (
            args: ReturnType<typeof action['call']>['args']
          ) =>
            this.get({
              apiRoute: config.route,
              httpOpts: args,
              responseType:
                defineResponseType<
                  ReturnType<typeof action['success']>['response']
                >(),
            });

          break;

        default:
          break;
      }
    });
  }

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
      paramsArrayFormat?: IStringifyOptions['arrayFormat'];
      cacheExpiresIn?: number;
      skipCache?: boolean;
    };
  }) {
    const route =
      typeof apiRoute === 'string' ? apiRoute : apiRoute(httpOpts?.queryParams);

    let cacheIdParams = 'NO_ARG' + JSON.stringify({ httpOpts, route, extras });

    const { apiBase, headers, responseType, queryString } = this._getCallConfig(
      httpOpts,
      extras
    );

    const cacheId = generateEntityId(cacheIdParams);
    const cacheItem = this._cache[cacheId];

    if (cacheItem) {
      if (
        new Date().getTime() < cacheItem.validUntil &&
        !extras?.skipCache &&
        !httpOpts?.actionOptions?.extras?.skipCache
      ) {
        return of(cacheItem.data) as Observable<ResponseType>;
      } else {
        delete this._cache[cacheId];
      }
    }

    return this._config.http
      .get<ResponseType>(
        `${apiBase}${route}${queryString ? '?' + queryString : ''}`,
        {
          headers: headers,
          observe: 'response',
          responseType: responseType as any,
        }
      )
      .pipe(
        tap((r) => {
          if (extras?.skipCache || httpOpts?.actionOptions?.extras?.skipCache) {
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
      paramsArrayFormat?: IStringifyOptions['arrayFormat'];
    };
  }) {
    const route =
      typeof apiRoute === 'string' ? apiRoute : apiRoute(httpOpts?.queryParams);

    const { apiBase, headers, responseType, queryString } = this._getCallConfig(
      httpOpts,
      extras
    );

    return this._config.http
      .post<ResponseType>(
        `${apiBase}${route}${queryString ? '?' + queryString : ''}`,
        httpOpts?.body,
        {
          headers: headers,

          responseType: responseType as any,
        }
      )
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
      paramsArrayFormat?: IStringifyOptions['arrayFormat'];
    };
  }) {
    const route =
      typeof apiRoute === 'string' ? apiRoute : apiRoute(httpOpts?.queryParams);

    const { apiBase, headers, params, responseType, queryString } =
      this._getCallConfig(httpOpts, extras);

    return this._config.http
      .put<ResponseType>(
        `${apiBase}${route}${queryString ? '?' + queryString : ''}`,
        httpOpts?.body,
        {
          headers: headers,
          responseType: responseType as any,
        }
      )
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
      paramsArrayFormat?: IStringifyOptions['arrayFormat'];
    };
  }) {
    const route =
      typeof apiRoute === 'string' ? apiRoute : apiRoute(httpOpts?.queryParams);

    const { apiBase, headers, responseType, queryString } = this._getCallConfig(
      httpOpts,
      extras
    );

    return this._config.http
      .patch<ResponseType>(
        `${apiBase}${route}${queryString ? '?' + queryString : ''}`,
        httpOpts?.body,
        {
          headers: headers,
          responseType: responseType as any,
        }
      )
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
      paramsArrayFormat?: IStringifyOptions['arrayFormat'];
    };
  }) {
    const route =
      typeof apiRoute === 'string' ? apiRoute : apiRoute(httpOpts?.queryParams);

    const { apiBase, headers, responseType, queryString } = this._getCallConfig(
      httpOpts,
      extras
    );

    return this._config.http
      .delete<ResponseType>(
        `${apiBase}${route}${queryString ? '?' + queryString : ''}`,
        {
          headers: headers,
          responseType: responseType as any,
        }
      )
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
    extras?: {
      apiBaseOverride?: string;
      paramsArrayFormat?: IStringifyOptions['arrayFormat'];
    }
  ) {
    const apiBase =
      extras?.apiBaseOverride || this._config.baseConfig.apiBase || '';
    const headers =
      httpOpts?.actionOptions?.headers ||
      httpOpts?.headers ||
      this._config.baseConfig?.headers;
    const params = httpOpts?.params || this._config.baseConfig?.params;
    const queryParams =
      httpOpts?.queryParams || this._config.baseConfig?.queryParams;
    const responseType =
      httpOpts?.responseType || this._config.baseConfig?.responseType || 'json';

    const queryString = stringify(params, {
      arrayFormat: extras?.paramsArrayFormat ?? 'brackets',
    });

    return { apiBase, headers, params, queryParams, responseType, queryString };
  }
}
