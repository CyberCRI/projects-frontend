import crypto from 'node:crypto'

/**
 * Server-side anonymization of agent conversations shown in the admin portal.
 *
 * Conversations of the requesting user are returned as is. Every other
 * conversation gets: a pseudonymous `userAlias` instead of `userId`, the user
 * profile context message replaced by REDACTED_USER_DATA, the author's name
 * (taken from that profile message) masked everywhere, and structured PII
 * (emails, phones, IBANs, ...) masked by regex.
 *
 * Known limits: names typed in chat other than the author's profile name, and
 * addresses, are NOT detected.
 */

export const REDACTED_USER_DATA = 'redacted user data'
const USER_CONTEXT_PREFIX = 'retriever_user_context'

// fallback when no salt is configured: aliases are then stable per process only
const processSalt = crypto.randomBytes(32).toString('hex')

type Message = {
  role?: string
  content?: string | null
  reasoning?: string | null
  toolCalls?: unknown
  toolCallId?: string | null
  [key: string]: unknown
}

type Conversation = {
  userId: number
  title?: string | null
  messages?: Message[]
  [key: string]: unknown
}

export function isUserContextMessage(message: Pick<Message, 'role' | 'toolCallId'>) {
  return message.role === 'tool' && !!message.toolCallId?.startsWith(USER_CONTEXT_PREFIX)
}

export function userAlias(userId: number, salt?: string) {
  return crypto
    .createHmac('sha256', salt || processSalt)
    .update(String(userId))
    .digest('hex')
    .slice(0, 8)
    .toUpperCase()
}

/**
 * WARNING: this depends on the exact format of the user-context message built in
 * `src/composables/useChatbotContext.ts` (a `- Name: <family_name> <given_name>` line).
 * Any change to that template must be mirrored here. If the format stops
 * matching, no names are extracted and name redaction is SILENTLY disabled
 * (only the regex-based `redactPii` remains).
 */
export function extractUserNamesAndId(userContextContent: object | null): string[] {
  let words = []
  if (userContextContent?.given_name && userContextContent?.family_name)
    words.push(userContextContent.given_name + ' ' + userContextContent.family_name)
  if (userContextContent?.family_name) words.push(userContextContent.family_name)
  if (userContextContent?.given_name) words.push(userContextContent.given_name)

  if (words.length) {
    // every word is a name part (particles like "de"/"van" included), matched on its own
    words = [
      ...words,
      ...words[0]
        .split(/[\s-]+/)
        .map((w) => w.trim())
        .filter((w) => w.length >= 2 && !['undefined', 'null'].includes(w.toLowerCase())),
    ]
  }
  console.log('extracted name token', words.sort((a, b) => a.length - b.length).join())
  return [...new Set(words)].sort((a, b) => a.length - b.length)
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export function redactNames(text: string, names: string[]) {
  if (!text || !names.length) return text
  // longest first so e.g. "Marie-Claire" is not cut at "Marie"
  const pattern = [...names]
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join('|')
  return text.replace(new RegExp(pattern, 'giu'), '[NAME]')
}

export function redactId(text: string, id: number | null) {
  console.log('redactid', id)
  if (!text || !id) return text
  return text.replace(new RegExp(`\\b${id}\\b`, 'giu'), '[ID]')
}

const PII_PATTERNS: [RegExp, string][] = [
  [/\bBearer\s+[A-Za-z0-9\-._~+/]+=*/gi, '[TOKEN]'],
  [/https?:\/\/[^\s/@]+:[^\s/@]+@\S+/gi, '[URL]'], // credentials in url
  [/https?:\/\/\S*[?&](?:token|key|secret|password|auth|sig|code)=\S*/gi, '[URL]'],
  [/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[EMAIL]'],
  [/\b[A-Z]{2}\d{2}(?:[ ]?[A-Z0-9]{4}){2,7}(?:[ ]?[A-Z0-9]{1,4})?\b/g, '[IBAN]'],
  [/\b(?:\d[ -]?){13,19}\b/g, '[NUMBER]'], // card-like
  // phone numbers, but not dates (2026-01-01, 01/02/2026)
  [
    /(?<![\w.])(?!\d{4}-\d{2}-\d{2})(?!\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4}(?!\d))\+?\d[\d .()-]{7,}\d(?![\w])/g,
    '[PHONE]',
  ],
]

export function redactPii(text: string) {
  if (!text) return text
  return PII_PATTERNS.reduce((acc, [re, label]) => acc.replace(re, label), text)
}

// PII regexes first so e.g. an email containing the name is masked as a whole
const redactText = (text: string, names: string[], id: number | null) =>
  redactId(redactNames(redactPii(text), names), id)

function redactJson(value: unknown, names: string[]): unknown {
  if (typeof value === 'string') return redactText(value, names)
  if (Array.isArray(value)) return value.map((v) => redactJson(v, names))
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, redactJson(v, names)]))
  }
  return value
}

export function anonymizeMessage(message: Message, names: string[], id: number | null): Message {
  if (isUserContextMessage(message)) {
    return { ...message, content: REDACTED_USER_DATA, reasoning: null, toolCalls: null }
  }
  return {
    ...message,
    content:
      typeof message.content === 'string'
        ? redactText(message.content, names, id)
        : message.content,
    reasoning:
      typeof message.reasoning === 'string'
        ? redactText(message.reasoning, names)
        : message.reasoning,
    toolCalls: message.toolCalls ? redactJson(message.toolCalls, names, id) : message.toolCalls,
  }
}

/**
 * @param userContextContent contents of the conversation's user-context messages when they
 *   are not (all) part of `conversation.messages` (e.g. paginated page). A conversation holds
 *   several of them (user profile AND page context, saved on every turn) and only some
 *   contain the `- Name:` line, so names are collected from all of them.
 */
export function anonymizeConversation<T extends Conversation>(
  conversation: T,
  requesterId: number,
  {
    userContextContent,
    salt,
  }: { userContextContent?: (object | null)[] | string | null; salt?: string } = {}
) {
  if (conversation.userId === requesterId) return { ...conversation, isOwn: true }

  const contents = [
    ...(conversation.messages?.filter(isUserContextMessage).map((m) => m.content) ?? []),
  ]
  const names = extractUserNamesAndId(userContextContent)

  const { userId, ...rest } = conversation
  return {
    ...rest,
    isOwn: false,
    userAlias: userAlias(userId, salt),
    title: typeof rest.title === 'string' ? redactText(rest.title, names) : rest.title,
    messages: rest.messages?.map((m) => anonymizeMessage(m, names, userContextContent?.id || null)),
  }
}
