#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { BigdataApiClient } from './client.js';
import { registerTools } from './tools/index.js';

async function main() {
  const apiClient = new BigdataApiClient();
  const tools = registerTools(apiClient);

  const server = new Server(
    {
      name: 'bigdata-mcp-server',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // 도구 목록 핸들러
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: tools.map((t) => ({
        name: t.name,
        description: t.description,
        inputSchema: t.inputSchema,
      })),
    };
  });

  // 도구 호출 핸들러
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const tool = tools.find((t) => t.name === name);

    if (!tool) {
      throw new Error(`지원하지 않는 도구 이름입니다: ${name}`);
    }

    try {
      const result = await tool.handler(args || {});
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
        structuredContent: result,
      };
    } catch (err: any) {
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `[BIGDATA MCP 오류] ${err.message}`,
          },
        ],
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('BIGDATA MCP Server connected via stdio transport');
}

main().catch((err) => {
  console.error('Fatal server error:', err);
  process.exit(1);
});
