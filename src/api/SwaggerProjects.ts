import { defaultBaseURL, defaultOptions } from '@/composables/useAPI'
import { ApiConfig, RequestParams, Api as SwaggerApi } from './Swagger'

export class ApiProjects extends SwaggerApi<unknown> {
  public override baseUrl: string = defaultBaseURL(false)

  constructor(config: ApiConfig = {}) {
    const customFetch = (...fetchParams: Parameters<typeof fetch>): ReturnType<typeof $fetch> =>
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

export const api = new ApiProjects()
