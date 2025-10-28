import { defaultBaseURL, defaultOptions } from '@/composables/useAPI'
import { ApiConfig, RequestParams, Api as SwaggerApi } from './Swagger'
// use ofetch instead of $fetch ($fetch is a alias to ofetch)
// because typescript show error using $fetch

import { ofetch } from 'ofetch'

export class ApiProjects extends SwaggerApi<typeof ofetch> {
  public override baseUrl: string = defaultBaseURL(false)

  constructor(config: ApiConfig = {}) {
    const customFetch = (...fetchParams: Parameters<typeof ofetch>) => {
      return ofetch(...fetchParams)
    }

    super({
      customFetch,
      ...config,
    })
  }

  override mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    // merge request options with projects
    const p = super.mergeRequestParams(params1, params2)

    return {
      ...defaultOptions(),
      ...p,
    }
  }
}

export const api = new ApiProjects()
