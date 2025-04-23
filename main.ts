import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { ToolActionTableScheme, ToolActionSelect, ToolActionSelectWhere, ToolActionInsert } from "./tools.js";
import pg from 'pg';
const { Pool } = pg;

const server = new Server(
  {
    name: "example-servers/postgres",
    version: "0.1.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  },
);

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'testMCP',
  password: '123456',
  port: 5432
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [{
      name: "Action Table Scheme",
      description: "Execute action to get table scheme",
      inputSchema: {
        type: "object",
        properties: {
          tableName: { type: "string" }
        },
        required: ["tableName"]
      }
    },{
      name: "Action Select",
      description: "Execute select action on the database",
      inputSchema: {
        type: "object",
        properties: {
          tableName: { type: "string" }
        },
        required: ["tableName"]
      }
    },
    {
      name: "Action Select Where",
      description: "Execute select action with where on the database",
      inputSchema: {
        type: "object",
        properties: {
          tableName: { type: "string" },
          whereCondition: { type: "string" }
        },
        required: ["tableName", "whereCondition"]
      }
    }, {
      name: "Action Insert",
      description: "Execute insert action on the database",
      inputSchema: {
        type: "object",
        properties: {
          tableName: { type: "string" },
          dataJson: { type: "string" }
        },
        required: ["tableName", "dataJson"]
      }
    }]
  };
});

// Handle tools execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "Action Select") {
    return await ToolActionSelect(pool, request);
  } else if (request.params.name === "Action Select Where") {
    return await ToolActionSelectWhere(pool, request);
  } else if (request.params.name === "Action Insert") {
    return await ToolActionInsert(pool, request);
  } else if (request.params.name === "Action Table Scheme") {
    return await ToolActionTableScheme(pool, request);
  }
  throw new Error("Tool not found");
});

const transport = new StdioServerTransport();
await server.connect(transport);