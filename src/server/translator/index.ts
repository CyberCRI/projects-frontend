/**
 * Translation Agent — LangChain JS v1 (June 2026)
 *
 * Input:
 *   fields      — { field_name: string; type: "text" | "html" | "markdown"; content: string }[]
 *   targetLangs — ISO 639-1 language codes, e.g. ["en", "fr", "ca", "es"]
 *
 * Output:
 *   { field_name: string; lang: string; content: string }[]
 *
 * Design
 *   • Single LLM call for the entire input array (one round-trip, no local lang detection).
 *   • The model detects each field's source language itself.
 *   • If a field is already in a target language, its content is returned verbatim.
 *   • HTML / Markdown structure is preserved; only visible text is translated.
 *   • Structured output via withStructuredOutput (Zod) — no fragile JSON parsing.
 *   • Uses initChatModel (universal model) — swap provider via MODEL_STRING env var.
 */

import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { initChatModel } from 'langchain/chat_models/universal'
import * as z from 'zod'

// ─── Types ───────────────────────────────────────────────────────────────────

export type ContentType = 'text' | 'html' | 'markdown'

export interface InputField {
  field_name: string
  type: ContentType
  content: string
}

export interface OutputField {
  field_name: string
  lang: string
  content: string
}

// ─── Zod output schema ───────────────────────────────────────────────────────

const OutputFieldSchema = z.object({
  field_name: z.string().describe('The field identifier, unchanged from input'),
  lang: z.string().describe('ISO 639-1 language code this translation is for'),
  content: z.string().describe('Translated (or verbatim) content'),
})

const TranslationResponseSchema = z.object({
  results: z
    .array(OutputFieldSchema)
    .describe('One entry per (field × target language) combination, in input order'),
})

// ─── System prompt ───────────────────────────────────────────────────────────

function buildSystemPrompt(targetLangs: string[]): string {
  const langList = targetLangs.join(', ')

  return `You are an expert multilingual translator and language-detection specialist.

You will receive a JSON array of content fields. Each field has:
  - field_name  : identifier string
  - type        : one of "text", "html", or "markdown"
  - content     : the source content to translate

Your task
─────────
For EACH field, produce one output object per target language (${langList}).

Step 1 — Detect the source language of each field's content (ISO 639-1 code).

Step 2 — For each target language:
  • If the detected source language MATCHES the target language, copy the content
    VERBATIM into the output — do NOT alter it in any way.
  • Otherwise, translate the content into the target language following the
    content-type rules below.

Content-type translation rules
───────────────────────────────
"text"
  Translate the plain text. Return only the translated string.

"html"
  • Preserve ALL HTML tags, attributes, and document structure exactly.
  • Translate ONLY visible text nodes (text between tags).
  • Do NOT translate tag names, attribute names, or attribute values
    (href, src, class, id, data-*, etc.).

"markdown"
  • Preserve ALL Markdown syntax: headings, bold, italic, links, images,
    code blocks, inline code, lists, tables, blockquotes, etc.
  • Translate ONLY human-readable prose.
  • Do NOT translate: code inside code fences/inline code, URLs,
    link/image targets.
  • DO translate: link display text, image alt text.

Output format
─────────────
Return a JSON object with a single key "results" containing an array of objects,
one per (field × target language):
  { "field_name": string, "lang": string, "content": string }

Order: iterate fields in input order, and for each field iterate target languages
in the order given: [${langList}].

Do not include any commentary, markdown fences, or keys outside "results".`
}

// ─── Helper: extract text from LLM response content ──────────────────────────

function extractText(content: string | Array<{ type: string; text?: string }>): string {
  if (typeof content === 'string') return content
  return content
    .filter((c): c is { type: 'text'; text: string } => c.type === 'text')
    .map((c) => c.text)
    .join('')
}

// ─── Main agent ──────────────────────────────────────────────────────────────

/**
 * Translate an array of content fields into all target languages in one LLM call.
 *
 * @param fields       Input fields (field_name, type, content).
 * @param targetLangs  ISO 639-1 target language codes, e.g. ["en", "fr", "es"].
 * @param modelString  LangChain universal model string, e.g. "anthropic:claude-sonnet-4-6".
 *                     Falls back to the MODEL_STRING env var, then to claude-sonnet-4-6.
 */
export default async function translationAgent(
  fields: InputField[],
  targetLangs: string[],
  inferenceApiKey: string,
  modelString: string
): Promise<OutputField[]> {
  if (fields.length === 0 || targetLangs.length === 0) return []

  // Initialise the universal model with structured output bound via Zod.
  const baseModel = await initChatModel(modelString, {
    temperature: 0.1,
    apiKey: inferenceApiKey,
  })
  const model = baseModel.withStructuredOutput(TranslationResponseSchema, {
    name: 'translation_response',
  })

  const systemPrompt = buildSystemPrompt(targetLangs)

  // Serialise the entire input array as the user turn.
  const userMessage = JSON.stringify(fields, null, 2)

  const response = await model.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(userMessage),
  ])

  // withStructuredOutput returns the parsed Zod object directly.
  return response.results
}
