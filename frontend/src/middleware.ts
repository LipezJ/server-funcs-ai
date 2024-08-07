import { defineMiddleware } from 'astro:middleware';
import { getSession } from 'auth-astro/server';

export const onRequest = defineMiddleware(async (context, next) => {
	const path = context.url.pathname;

	if (path.startsWith('/api/functions')) {
		const session = await getSession(context.request);

		if (!session) {
			return new Response('Unauthorized', { status: 401 });
		}

		const userId = session.user?.id;

		if (!userId) {
			return new Response('Invalid User', { status: 401 });
		}

		context.locals.user_id = userId;
	} else if (path.startsWith('/dashboard')) {
		const session = await getSession(context.request);

		if (!session) {
			return context.redirect('/api/auth/signin');
		}

		context.locals.user_id = session.user?.id as string;
		context.locals.avatar = session.user?.image;
	}

	return next();
});
