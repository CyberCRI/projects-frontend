import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { initChatModel } from 'langchain/chat_models/universal'
import * as z from 'zod'

export type ContentType = 'text' | 'html' | 'markdown'

export interface InputField {
  fieldName: string
  type: ContentType
  content: string
}

export interface OutputField {
  fieldName: string
  lang: string
  content: string
  detectedLang: string
}

const OutputFieldSchema = z.object({
  fieldName: z.string().describe('The field identifier, unchanged from input'),
  lang: z.string().describe('ISO 639-1 language code this translation is for'),
  content: z.string().describe('Translated (or verbatim) content'),
  detectedLang: z
    .string()
    .describe('ISO 639-1 language code of the detected orginal lang for input source language'),
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
  - fieldName  : identifier string
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
  { "fieldName": string, "lang": string, "content": string, "detectedLang": string }

Order: iterate fields in input order, and for each field iterate target languages
in the order given: [${langList}].

Do not include any commentary, markdown fences, or keys outside "results".`
}

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
