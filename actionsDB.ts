import { Pool } from 'pg';
import { boolean } from 'zod';

export async function ActionTableScheme (pool: Pool, tableName: string): Promise<string> {
    try {
        const isSafe: boolean = /^[a-zA-Z0-9_]+$/.test(tableName);
        if (!isSafe) {
            throw new Error("Parametro tabla inseguro");
        }
        const query = `
        SELECT column_name, data_type, is_nullable, character_maximum_length
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = $1;
        `;
        const result = await pool.query(query, [tableName]);
        return JSON.stringify(result.rows, null, 2);
    } catch(error: unknown) {
        if (error instanceof Error) {
            return `Error: ${error.message}`;
        } else {
            return 'Error desconocido';
        }
    }
}

export async function ActionSelect (pool: Pool, tableName: string): Promise<string> {
    try {
        const isSafe: boolean = /^[a-zA-Z0-9_]+$/.test(tableName);
        if (!isSafe) {
            throw new Error("Parametro tabla inseguro");
        }
        const result = await pool.query(`SELECT * FROM $1`, [tableName]);
        return JSON.stringify(result.rows, null, 2);
    } catch(error: unknown) {
        if (error instanceof Error) {
            return `Error: ${error.message}`;
        } else {
            return 'Error desconocido';
        }
    }
}

export async function ActionSelectWhere (pool: Pool, tableName: string, where: string): Promise<string> {
    try {
        const isSafe: boolean = /^[a-zA-Z0-9_]+$/.test(tableName);
        if (!isSafe) {
            throw new Error("Parametro tabla inseguro");
        }

        let query: string = `SELECT * FROM $1`;
        query += where !== "" ? ` WHERE $2` : '';	
        const result = await pool.query(query, [tableName, where]);

        return JSON.stringify(result.rows, null, 2);
    } catch(error: unknown) {
        if (error instanceof Error) {
            return `Error: ${error.message}`;
        } else {
            return 'Error desconocido';
        }
    }
}

export async function ActionInsert (pool: Pool, table: string, data: Array<object>) : Promise<string> {
    try {
        const isSafe: boolean = /^[a-zA-Z0-9_]+$/.test(table);
        if (!isSafe) {
            throw new Error("Parametro tabla inseguro");
        }

        const insertRecords = data.map((record) => {
            const values = Object.values(record);
            return `(${values.map((value) => `'${value}'`).join(", ")})`;
        }).join(",");

        const result = await pool.query(`INSERT INTO $1 VALUES $2`, [table, insertRecords]);
        return result?.rowCount?.toString() ?? "0";
    } catch(error: unknown) {
        if (error instanceof Error) {
            return `Error: ${error.message}`;
        } else {
            return 'Error desconocido';
        }
    }
}