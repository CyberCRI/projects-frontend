import type { McpServer as OrginalMcpServer } from '@modelcontextprotocol/sdk/server/mcp'

// tempoary fix for schema intput/output from zod
// see: https://github.com/modelcontextprotocol/typescript-sdk/issues/906

type Schema = {
  [key: string]: any
}

export type TypeMcpServer = Omit<OrginalMcpServer, 'registerTool'> & {
  registerTool: (
    name: string,
    config: Omit<
      Parameters<OrginalMcpServer['registerTool']>[1],
      'inputSchema' | 'outputSchema'
    > & {
      inputSchema?: Schema
      outputSchema?: Schema
    },
    cb: Parameters<OrginalMcpServer['registerTool']>[2]
  ) => ReturnType<OrginalMcpServer['registerTool']>
}
