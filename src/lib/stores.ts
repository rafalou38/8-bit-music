import { writable } from 'svelte/store';
import { uniqueID } from './helpers';

export const notes = writable([] as INote[]);
export const keys_count = writable(5);

function default_key() {
	return { duration: 1, id: uniqueID(), active: false };
}

function updateNotesWrapper(notes_?: INote[], keys_count_?: number) {
	if (!notes_) {
		notes.update((notes__) => {
			notes_ = notes__;
			return notes__;
		});
	}
	if (!keys_count_) {
		keys_count.update((keys_count__) => {
			keys_count_ = keys_count__;
			return keys_count__;
		});
	}
	updateNotes(notes_, keys_count_);
}

function updateNotes(notes_: INote[], keys_count_: number): void {
	let changed = false;

	for (let i = 0; i < notes_.length; i++) {
		const newNote = { ...notes_[i] };

		while (newNote.keys.length !== keys_count_) {
			if (newNote.keys.length < keys_count_) {
				newNote.keys.push(default_key());
				changed = true;
			}
			if (newNote.keys.length > keys_count_) {
				newNote.keys.pop();
				changed = true;
			}
		}
	}
	if (changed) {
		notes.set(notes_);
	}
}

notes.subscribe((e) => updateNotesWrapper(e));
keys_count.subscribe((e) => updateNotesWrapper(undefined, e));
