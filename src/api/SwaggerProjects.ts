import { defaultBaseURL, defaultOptions } from '@/composables/useAPI'
import {
  ApiConfig,
  FullRequestParams,
  HttpResponse,
  RequestParams,
  Api as SwaggerApi,
} from './Swagger'

export class Api extends SwaggerApi<unknown> {
  public override baseUrl: string = defaultBaseURL(false)

  constructor(config: ApiConfig) {
    const customFetch = (...fetchParams: Parameters<typeof fetch>): ReturnType<typeof fetch> =>
      $fetch(fetchParams[0] as string, fetchParams[1] as object)

    super({
      customFetch,
      ...config,
    })
  }

  override mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    const p = super.mergeRequestParams(params1, params2)

    return {
      ...defaultOptions(),
      ...p,
    }
  }
}

export class ApiNuxt extends Api {
  // default use $fetch, if is true, return a useFetch objects
  private nuxtKey: string = ''
  constructor(config: ApiConfig & { nuxtKey: '' } = { nuxtKey: '' }) {
    super(config)
    this.nuxtKey = config.nuxtKey
  }

  public override request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    return super.request(body, secure, path, type, query, format, baseUrl, cancelToken, ...params)
  }
}
