import { encode, decode } from '$lib/serialization';
import { notes } from './notes';

const changes: string[] = [];
let changeIndex = 0;
let changed = false;

let counter = 0;
notes.subscribe(async (newNotes) => {
	counter++;
	if (changed) {
		changed = false;
	} else if (counter % 2 == 1) {
		console.time('encode');
		changes[changeIndex + 1] = encode(newNotes);
		console.timeEnd('encode');
		if (changes.length >= 20) {
			changes.splice(0, 5);
		}
		changeIndex = changes.length - 1;
		console.log({ changeIndex, changes });
	}
});

export function undoChanges(): void {
	if (!changes[changeIndex - 1]) return;
	changed = true;
	changeIndex--;
	const newNotes = decode(changes[changeIndex]).data;
	if (newNotes.length > 0) {
		notes.update((oldNotes) => conserveIDS(newNotes, oldNotes));
	}
}
export function redoChanges(): void {
	if (!changes[changeIndex + 1]) return;
	changed = true;
	changeIndex++;
	const newNotes = decode(changes[changeIndex]).data;
	if (newNotes.length > 0) {
		notes.update((oldNotes) => conserveIDS(newNotes, oldNotes));
	}
}

function conserveIDS(newNotes: INote[], oldNotes: INote[]) {
	oldNotes.forEach((note, ny) => {
		if (!newNotes[ny]) return;
		newNotes[ny].id = note.id;
		note.keys.forEach((key, ky) => {
			if (!newNotes[ny].keys[ky]?.id) return;
			newNotes[ny].keys[ky].id = key.id;
		});
	});

	return newNotes;
}
