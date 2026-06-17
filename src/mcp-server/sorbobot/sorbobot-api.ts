import type { $Fetch, FetchOptions } from 'ofetch'
import { ofetch } from 'ofetch'

export const sorbobotCreateFetch = (config: FetchOptions = {}) =>
  ofetch.create({
    headers: {
      'User-Agent': 'LpiProject-SorboBot/1.0',
      ...(config.headers || {}),
    },
  })

type SorbobotResponseSession = {
  data: {
    session_id: number
  }
}
export type SorbobotAuthor = {
  id: string
}
export type SorbobotResponseData = {
  data: {
    authors: {
      [key: string]: SorbobotAuthor
    }
    search_results: any
  }
}

export default class SorbobotAPI {
  sessionId: null | number
  fetch: $Fetch

  constructor(apiToken: string, apiUrl: string) {
    this.sessionId = null

    // create base fetch
    this.fetch = sorbobotCreateFetch({
      baseURL: apiUrl,
      headers: {
        'api-key': apiToken,
      },
    })
  }
  async init() {
    const session = await this.fetch<SorbobotResponseSession>(`/api/sorbobot/session/start`, {
      method: 'POST',
    })
      .then((data) => {
        if (!data?.data?.session_id) {
          throw new Error(`Failed to start session: seesionId is empty`)
        }
        return data.data.session_id
      })
      .catch((error) => {
        console.error(error)
      })
    this.sessionId = session || null
  }

  async query<Result extends SorbobotResponseData>(queryPrompt: string) {
    return this.fetch<Result>(`/api/sorbobot/query`, {
      body: {
        session_id: this.sessionId,
        prompt: queryPrompt,
        search_results: null,
      },
    }).then((data) => {
      const { authors, search_results } = data.data

      const authorsArrays = Object.entries(authors)
      const limitedAuthors = Object.fromEntries(authorsArrays.slice(0, 12))

      return {
        authors: limitedAuthors,
        search_results,
      }
    })
  }
  async close() {
    if (!this.sessionId) {
      console.info("Can't close sorbobot session: sessionId is empty")
      return
    }

    await this.fetch<undefined>(`/api/sorbobot/session/end/${encodeURIComponent(this.sessionId)}`, {
      method: 'DELETE',
    })
      .then(() => {
        this.sessionId = null
      })
      .catch((error) => {
        console.error(error)
      })
  }
}
