import { browser } from '$app/env';
import { Updater, Writable, writable } from 'svelte/store';

interface ISession {
	authenticated: boolean;
	username?: string;
}

interface SessionStore extends Writable<ISession> {
	fetch: () => void;
}

function createSessionStore(): SessionStore {
	const { subscribe, set, update } = writable({} as ISession);

	let is_not_set = true;
	function fetchSession() {
		fetch('/getSession').then((r) => {
			r.json().then(set);
		});
	}

	return {
		fetch: fetchSession,
		subscribe: (run, invalidate?) => {
			if (is_not_set && browser) {
				is_not_set = false;
				fetchSession();
			}
			return subscribe(run, invalidate);
		},
		set: (value) => {
			set(value);
		},
		update: (updater: Updater<ISession>) => {
			update(updater);
		}
	};
}

export const sessionStore = createSessionStore();
