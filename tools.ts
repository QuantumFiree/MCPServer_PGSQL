import { array, strictObject, z } from "zod";
import { ActionSelect, ActionSelectWhere, ActionInsert, ActionTableScheme } from "./actionsDB";
import { Pool } from 'pg';

export async function ToolActionTableScheme(pool: Pool, request) {
  const argsSchema = z.object({
    tableName: z.string().optional()
  });
  const parsed = argsSchema.safeParse(request.params.arguments);
  
  const table: string = parsed.success ? parsed.data.tableName?.trim() ?? "" : "";

  const data = await ActionTableScheme(pool, table);
  return {
    content: [
      {
        type: "text",
        text: data
      }
    ]
  };
}

export async function ToolActionSelect(pool: Pool, request) {
  const argsSchema = z.object({
    tableName: z.string().optional()
  });
  const parsed = argsSchema.safeParse(request.params.arguments);
  
  const table: string = parsed.success ? parsed.data.tableName?.trim() ?? "" : "";

  const data = await ActionSelect(pool, table);
  return {
    content: [
      {
        type: "text",
        text: data
      }
    ]
  };
}

export async function ToolActionSelectWhere(pool: Pool, request) {
  const argsSchema = z.object({
    tableName: z.string().optional(),
    whereCondition: z.string().optional(),
  });
  const parsed = argsSchema.safeParse(request.params.arguments);

  const table: string = parsed.success ? parsed.data.tableName?.trim() ?? "" : "";
  const where: string = parsed.success ? parsed.data.whereCondition?.trim() ?? "" : "";
  const data = await ActionSelectWhere(pool, table, where);
  return {
    content: [
      {
        type: "text",
        // text: `Estos son los elementos de la tabla ${table}, con las condiciones ${where}`
        text: data
      }
    ]
  };
}

export async function ToolActionInsert(pool: Pool, request) {
  const argsSchema = z.object({
    tableName: z.string().optional(),
    dataJson: z.string().optional()
  });
  const parsed = argsSchema.safeParse(request.params.arguments);

  const table: string = parsed.success ? parsed.data.tableName ?? "" : "";
  const data: string = parsed.success ? parsed.data.dataJson ?? "" : "";

  const jsonData = JSON.parse(data);
  const insertData = await ActionInsert(pool, table, jsonData);

  return {
    content: [
      {
        type: "text",
        text: `Estos elementos fueron insertados ${jsonData} en la tabla ${table}`
      }
    ]
  };
}