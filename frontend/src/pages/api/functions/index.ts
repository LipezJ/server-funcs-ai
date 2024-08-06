import { db } from '@db/db';
import { functions } from '@db/schemas';
import type { APIRoute } from 'astro';
import { and, eq } from 'drizzle-orm';

interface FunctionData {
  func_id?: string;
  code?: string;
  type?: string;
}

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const query = new URL(request.url).searchParams;
    const funcId = query.get('id');

    if (!funcId) {
      return new Response('Bad Request', { status: 400 });
    }

    const result = await db.select()
      .from(functions)
      .where(and(eq(functions.user_id, locals.user_id), eq(functions.func_id, funcId)))
      .run();

    const func = result.rows[0];

    return new Response(
      JSON.stringify(func), 
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    return new Response('Bad Request', { status: 400 });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json() as FunctionData;

    const result = await db.insert(functions)
      .values({
        func_id: body.func_id ?? Math.random().toString(36).substring(7),
        user_id: locals.user_id,
        code: body.code,
        type: body.type
      })
      .run();

    if (result.rowsAffected === 0) {
      return new Response('Not Found', { status: 404 });
    }

    return new Response(undefined, { status: 200 });
  } catch {
    return new Response('Bad Request', { status: 400 });
  }
  
};

export const PATCH: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json() as FunctionData;
    const funcId = body.func_id;

    if (!funcId) {
      return new Response('Bad Request', { status: 400 });
    }

    let data: FunctionData;

    if (!body.code) {
      data = {
        type: body.type
      }
    } else if (!body.type) {
      data = {
        code: body.code
      }
    } else {
      data = {
        code: body.code,
        type: body.type
      }
    }

    const result = await db.update(functions)
        .set(data)
        .where(and(eq(functions.user_id, locals.user_id), eq(functions.func_id, funcId)))
        .run();

    if (result.rowsAffected === 0) {
      return new Response('Not Found', { status: 404 });
    }

    return new Response(undefined, { status: 200 });
  } catch {
    return new Response('Bad Request', { status: 400 });
  }
};

export const DELETE: APIRoute = async ({ request, locals }) => {
  try {
    const query = new URL(request.url).searchParams;
    const funcId = query.get('id');

    if (!funcId) {
      return new Response('Bad Request', { status: 400 });
    }

    const result = await db.delete(functions)
      .where(and(eq(functions.user_id, locals.user_id), eq(functions.func_id, funcId)))
      .run();

    if (result.rowsAffected === 0) {
      return new Response('Not Found', { status: 404 });
    }

    return new Response(undefined, { status: 200 });
  } catch {
    return new Response('Bad Request', { status: 400 });
  }
}
