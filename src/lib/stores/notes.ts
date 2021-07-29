import { writable } from 'svelte/store';
import { uniqueID } from '../helpers';

export const notes = writable([] as INote[]);

export function default_key(): IKey {
	return { duration: 1, id: uniqueID(), active: false };
}

export function addKey(): void {
	notes.update((oldNotes) => {
		return oldNotes.map((note) => {
			note.keys.push(default_key());
			return note;
		});
	});
}
