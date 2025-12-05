import { tokenMap, traceMcp } from '@/server/routes/api/chat-stream'

const runtimeConfig = useRuntimeConfig()

export function getUserToken(extras) {
  const convesrationId = (extras.requestInfo.headers['authorization'] || '').replace('Bearer ', '')
  traceMcp('Tool Getting user token for conversationId', convesrationId)
  const tokenEntry = tokenMap.get(convesrationId)
  if (tokenEntry) {
    traceMcp('MCP tool found token for conversationId', tokenEntry.token.substring(0, 6) + '...')
    return tokenEntry.token
  } else {
    traceMcp('MCP tool no token found for conversationId', convesrationId)
  }
  return null
}

export function mcpFetch(url: string, options: any, extras: any = {}) {
  const _options = options || {}
  const accessToken = getUserToken(extras)
  if (accessToken) {
    if (!_options.headers) {
      _options.headers = {}
    }
    _options.headers['Authorization'] = `Bearer ${accessToken}`
  }
  return $fetch(url, _options)
}

export const orgCode = runtimeConfig.public.appApiOrgCode

export const API_BASE_URL =
  runtimeConfig.public.appApiUrl + runtimeConfig.public.appApiDefaultVersion + '/'
