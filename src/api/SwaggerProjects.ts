import { defaultOptions, defaultBaseURL } from '@/composables/useAPI'
import { FullRequestParams, Api as SwaggerApi } from './Swagger'
// use ofetch instead of $fetch ($fetch is a alias to ofetch)
// because typescript show error using $fetch
import { ofetch } from 'ofetch'

export class ApiProjects extends SwaggerApi<typeof ofetch> {
  public override request = async <T = any>({
    body,
    path,
    query,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<T> => {
    const requestParams = this.mergeRequestParams(params)
    const signal =
      (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null

    return ofetch<T>(path, {
      ...defaultOptions(),
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
      },
      signal,
      baseURL: defaultBaseURL(false),
      query,
      body,
    })
  }
}

export const api = new ApiProjects()
