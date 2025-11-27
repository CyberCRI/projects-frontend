import { traceSorbobot } from '@/server/routes/api/chat-stream'
export async function initSession(api_url, api_token) {
  // start session
  const startResp = await fetch(`${api_url}/api/sorbobot/session/start`, {
    method: 'POST',
    headers: {
      'User-Agent': 'LpiProject-SorboBot/1.0',
      Accept: 'application/json',
      'api-key': api_token,
    },
    body: null,
  })

  const jsonResp = await startResp.json()
  const sessionId = jsonResp?.data?.session_id

  if (!sessionId) {
    console.error('Failed to start session')
    return
  }
  return sessionId
}

export async function makeQuery(api_url, api_token, sessionId, queryPrompt) {
  const url = `${api_url}/api/sorbobot/query`
  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'LpiProject-SorboBot/1.0',
    Accept: 'application/json',
    'api-key': api_token,
  }
  const body = JSON.stringify({
    session_id: sessionId,
    prompt: queryPrompt,
    search_results: null,
  })

  traceSorbobot('Sorbobot query:')
  traceSorbobot(url)
  traceSorbobot(body)

  let queryJson = {}
  try {
    const queryResp = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body,
    })
    queryJson = await queryResp.json()
  } catch (error) {
    console.error('Error during Sorbobot query:', error)
    throw error
  }

  traceSorbobot('Sorbobot response:')
  traceSorbobot(JSON.stringify(queryJson, null, 2))

  const { authors, search_results } = queryJson.data

  const authorsArrays = Object.entries(authors)
  const limitedAuthors = Object.fromEntries(authorsArrays.slice(0, 2))

  return {
    authors: limitedAuthors,
    search_results,
  }
}

export async function closeSession(api_url, api_token, sessionId) {
  const closeResp = await fetch(`${api_url}/api/sorbobot/session/end/${sessionId}`, {
    method: 'DELETE',
    headers: {
      'User-Agent': 'LpiProject-SorboBot/1.0',
      Accept: 'application/json',
      'api-key': api_token,
    },
    body: null,
  })

  return closeResp.ok
}

export default class SorbobotAPI {
  constructor(apiToken, apiUrl) {
    this.apiToken = apiToken
    this.apiUrl = apiUrl
    this.sessionId = null
  }
  async init() {
    this.sessionId = await initSession(this.apiUrl, this.apiToken)
    return this.sessionId
  }
  async query(queryPrompt) {
    return await makeQuery(this.apiUrl, this.apiToken, this.sessionId, queryPrompt)
  }
  async close() {
    const hasclosed = await closeSession(this.apiUrl, this.apiToken, this.sessionId)
    if (hasclosed) {
      this.sessionId = null
    }
    return hasclosed
  }
}
