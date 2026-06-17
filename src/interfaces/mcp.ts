import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp'

// tempoary fix for schema intput/output from zod
// see: https://github.com/modelcontextprotocol/typescript-sdk/issues/906

type Schema = {
  [key: string]: any
}

export type TypeMcpServer = Omit<McpServer, 'registerTool'> & {
  registerTool: (
    name: string,
    config: Omit<Parameters<McpServer['registerTool']>[1], 'inputSchema' | 'outputSchema'> & {
      inputSchema?: Schema
      outputSchema?: Schema
    },
    cb: Parameters<McpServer['registerTool']>[2]
  ) => ReturnType<McpServer['registerTool']>
}
