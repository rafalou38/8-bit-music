
import { create_user, get_user } from '$lib/server/users';
import type { IUser } from '$lib/models/user';
import type { RequestHandler } from '@sveltejs/kit'
import { createSession } from '$lib/server/sessions';

import cookie from 'cookie'

export const post: RequestHandler = async (r) => {
	let username: string;
	let password: string;

	// => get data from request
	try {
		username = (r.body as any).username;
		password = (r.body as any).password;
	} catch {
		return { status: 422, body: "invalid request"  }
	}

	// => check data
	if ((!password && !username) || password.length != 32) {
		return { status: 422, body: "invalid request" }
	}

	// => verify if exists user
	let user = await get_user(username);

	if (user !== null) {
		return {
			status: 409,
			body:"user already exists"
		}
	}

	// => create user
	user = await create_user(username, password);


	const date = new Date()
	date.setMonth(date.getMonth() + 1)
	// => create session
	const sessionId = await createSession(user)
	const headers = {
		'Set-Cookie': cookie.serialize("session", sessionId, {
			sameSite: true,
			expires: date,
			path: "/"
		})
	}
	return {
		status: 200,
		headers,
		body: "success"
	}
}