import { pool } from "@/lib/db";

export async function GET() {
    const result = await pool.query("SELECT NOW()");
    return Response.json(result.rows[0]);
}