import cookie from "cookie";
import type { GetContext, GetSession } from '@sveltejs/kit'
import { getSession as getUserSession } from "$lib/server/sessions";

export const getContext: GetContext = async ({headers}) => {
	const cookies = cookie.parse(headers.cookie || "")

	if (!cookies.session) return {
		authenticated: false
	}

	const userSession = await getUserSession(cookies.session);

	if (userSession) {
		return {
			authenticated: true,
			username: userSession.username
		}
	}else{
		return {
			authenticated: false,
			expired: true
		}
	}
}

export const getSession: GetSession = async ({context}) => {
	return context
}