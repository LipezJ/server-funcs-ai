import type { APIRoute } from 'astro';
import { db } from '@db/db';
import { functionTable } from '@db/schemas';
import { eq } from 'drizzle-orm';

export const GET: APIRoute = async ({ request, locals }) => {
	const session = locals

	if (!session) {
		return new Response('Unauthorized', { status: 401 });
	}

	const user = session.user;
	const userId = user?.id;

	if (!userId) {
		return new Response('Unauthorized', { status: 401 });
	}

	const result = await db
		.select({
			func_id: functionTable.func_id,
			type: functionTable.type,
		})
		.from(functionTable)
		.where(eq(functionTable.user_id, userId))
		.all();

	return new Response(JSON.stringify(result), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
};
