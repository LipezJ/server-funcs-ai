import type { APIRoute } from 'astro';
import { getSession } from 'auth-astro/server';
import { db } from '@db/db';
import { functions } from '@db/schemas';
import { eq } from 'drizzle-orm';

export const GET: APIRoute = async ({ request }) => {

  const session = await getSession(request)

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const user = session.user;
  const userId = user?.id;

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const result = await db.select({
      func_id: functions.func_id,
      type: functions.type
    })
    .from(functions)
    .where(eq(functions.user_id, userId))
    .all()

  return new Response(
    JSON.stringify(result), 
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
