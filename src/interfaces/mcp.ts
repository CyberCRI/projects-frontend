import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp'
import type z from 'zod'

// tempoary fix for schema intput/output from zod
// see: https://github.com/modelcontextprotocol/typescript-sdk/issues/906

type BaseSchema = {
  [key: string]: any
}

type Schema = BaseSchema | BaseSchema[]

type ToolResult<T> = {
  content: [{ type: 'text'; text: string }]
  structuredContent?: T
}

// TODO: check if values is zod element, infer to it or put direclty T
type InferField<T> = z.infer<T>

export type InferSchema<T> = {
  [K in keyof T]: InferField<T[K]>
}

export type ToolCallback<InputArgs, OutputSchema> = (
  args: InferSchema<InputArgs>,
  extra: Parameters<RegisterToolCallback>[1]
) => Promise<ToolResult<InferSchema<OutputSchema>>> | ToolResult<InferSchema<OutputSchema>>

type RegisterToolCallback = Parameters<McpServer['registerTool']>[2]

export type TypeMcpServer = Omit<McpServer, 'registerTool'> & {
  registerTool: <InputSchema extends Schema, OutputSchema extends Schema>(
    name: string,
    config: Omit<Parameters<McpServer['registerTool']>[1], 'inputSchema' | 'outputSchema'> & {
      inputSchema?: InputSchema
      outputSchema?: OutputSchema
    },
    cb: ToolCallback<InputSchema, OutputSchema>
  ) => ReturnType<McpServer['registerTool']>
}
