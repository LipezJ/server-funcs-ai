import { db } from '@db/db';
import { functionTable } from '@db/schemas';
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
		const userId = locals.user?.id;

		if (!funcId) return new Response('Bad Request', { status: 400 });
		if (!userId) return new Response('Unauthorized', { status: 401 });

		const result = await db
			.select()
			.from(functionTable)
			.where(
				and(
					eq(functionTable.user_id, userId),
					eq(functionTable.func_id, funcId),
				),
			)
			.run();

		if (result.rows.length === 0) {
			return new Response('Not Found', { status: 404 });
		}

		const func = result.rows[0];

		return new Response(JSON.stringify(func), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (e) {
		return new Response('Bad Request', { status: 400 });
	}
};

export const POST: APIRoute = async ({ request, locals, redirect }) => {
	try {
		const form = await request.formData();
		const userId = locals.user?.id;
		let funcId =
			form.get('func_id')?.toString()?.trim() ??
			Math.random().toString(36).substring(7);

		if (funcId.length < 7) return new Response('Bad Request', { status: 400 });
		if (!userId) return new Response('Unauthorized', { status: 401 });

		const result = await db
			.insert(functionTable)
			.values({
				func_id: funcId,
				user_id: userId,
				code: form.get('code')?.toString(),
				type: form.get('type')?.toString(),
			})
			.run();

		if (result.rowsAffected === 0) {
			return new Response('Not Found', { status: 404 });
		}

		return new Response(JSON.stringify({ func_id: funcId }), { status: 200 });
	} catch {
		return new Response('Bad Request', { status: 500 });
	}
};

export const PATCH: APIRoute = async ({ request, locals }) => {
	try {
		const body = (await request.json()) as FunctionData;
		const funcId = body.func_id;
		const userId = locals.user?.id;

		if (!funcId) return new Response('Bad Request', { status: 400 });
		if (!userId) return new Response('Unauthorized', { status: 401 });

		let data: FunctionData;

		if (!body.code) {
			data = {
				type: body.type,
			};
		} else if (!body.type) {
			data = {
				code: body.code,
			};
		} else {
			data = {
				code: body.code,
				type: body.type,
			};
		}

		const result = await db
			.update(functionTable)
			.set(data)
			.where(
				and(
					eq(functionTable.user_id, userId),
					eq(functionTable.func_id, funcId),
				),
			)
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
		const body = await request.json();
		const funcId = body.id as string;
		const userId = locals.user?.id;

		if (!funcId) return new Response('Bad Request', { status: 400 });
		if (!userId) return new Response('Unauthorized', { status: 401 });

		const result = await db
			.delete(functionTable)
			.where(
				and(
					eq(functionTable.user_id, userId),
					eq(functionTable.func_id, funcId),
				),
			)
			.run();

		if (result.rowsAffected === 0) {
			return new Response('Not Found', { status: 404 });
		}

		return new Response(undefined, { status: 200 });
	} catch {
		return new Response('Bad Request', { status: 400 });
	}
};
