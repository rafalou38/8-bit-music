import type { RequestHandler } from '@sveltejs/kit';
import cookie from 'cookie';
import { getSession as getUserSession } from '$lib/server/sessions';

export const get: RequestHandler = async function (r) {
	console.log('sesion got');

	const cookies = cookie.parse(r.headers.cookie || '');

	if (!cookies.session)
		return {
			status: 301,
			body: {
				authenticated: false
			}
		};

	const userSession = await getUserSession(cookies.session);

	if (userSession) {
		return {
			status: 200,
			body: {
				authenticated: true,
				username: userSession.username
			}
		};
	} else {
		return {
			status: 301,
			body: {
				authenticated: false
			}
		};
	}
};
