import type {
  BooleanSchema,
  ElicitRequestFormParams,
  ElicitResult,
  MultiSelectEnumSchema,
  NumberSchema,
  PrimitiveSchemaDefinition,
  SingleSelectEnumSchema,
  StringSchema,
} from '@modelcontextprotocol/server'

export type {
  BooleanSchema,
  MultiSelectEnumSchema,
  NumberSchema,
  PrimitiveSchemaDefinition,
  SingleSelectEnumSchema,
  StringSchema,
}

/** MCP string schema, plus the JSON-schema `pattern` keyword that the form honours */
export type StringField = StringSchema & { pattern?: string }

/** One MCP form-elicitation request: a message and the schema of the requested fields */
export type ElicitationRequestBody = ElicitRequestFormParams

/** One pending elicitation (an interrupt), holding one request per requestKey */
export interface ElicitationItem {
  id: string
  requests: Record<string, ElicitationRequestBody>
}

/** Payload sent by the chat endpoint with `role: 'elicitations'` */
export interface ElicitationPayload {
  role?: 'elicitations'
  text?: string
  is_done?: boolean
  conversationId?: string
  elicitations: ElicitationItem[]
}

/** Value of a submitted field */
export type ElicitationFieldValue = string | number | boolean | string[]

/** Answer to a single request */
export interface ElicitationResponse {
  action: ElicitResult['action']
  content?: Record<string, ElicitationFieldValue>
}

/** Answers to all the requests of an elicitation, by requestKey */
export type ElicitationResponses = Record<string, ElicitationResponse>

/** A single option of a (single or multi) select field */
export interface ElicitationOption {
  const: string
  title: string
}

// --- field type guards: mirror the dispatch done by ElicitationSubForm ---

export const isStringField = (def: PrimitiveSchemaDefinition | undefined): def is StringField =>
  def?.type === 'string' && !('enum' in def && def.enum) && !('oneOf' in def && def.oneOf)

export const isNumericField = (def: PrimitiveSchemaDefinition | undefined): def is NumberSchema =>
  def?.type === 'number' || def?.type === 'integer'

export const isBooleanField = (def: PrimitiveSchemaDefinition | undefined): def is BooleanSchema =>
  def?.type === 'boolean'

export const isSingleSelectField = (
  def: PrimitiveSchemaDefinition | undefined
): def is SingleSelectEnumSchema =>
  def?.type === 'string' && (('oneOf' in def && !!def.oneOf) || ('enum' in def && !!def.enum))

export const isMultiSelectField = (
  def: PrimitiveSchemaDefinition | undefined
): def is MultiSelectEnumSchema => def?.type === 'array' && 'items' in def && !!def.items
