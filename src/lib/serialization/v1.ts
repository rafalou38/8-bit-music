import pColor from 'pure-color';

import { uniqueID } from '$lib/helpers';
import { b62_to_dec, dec_to_b62 } from './_helpers';

function compressNumber(n: string, big = false): string {
	n = n.match(/1+|0+/g).reduce((p, c) => {
		while (c.length > 0) {
			if (c.length < 2) {
				p = p + c;
				break;
			} else if (c.length > 9) {
				p = p + 9 + c[0];
				c = c.slice(9);
			} else {
				p = p + c.length.toString() + c[0];
				break;
			}
		}
		return p;
	}, '');
	return n;
}

export function encode(notes: INote[]): string {
	const version = '1';

	const d = notes.map((note) => {
		// debugger;
		let keys: (1 | 0)[] | (1 | 0) | string = note.keys.map((key) => {
			return key.active ? 1 : 0;
		});
		const zeros = keys.filter((key) => key == 0).length;
		const ones = keys.filter((key) => key == 1).length;
		if (zeros === keys.length) {
			keys = 0;
		} else if (ones === keys.length) {
			keys = 1;
		}
		keys = keys.toString().replace(/,/gm, '');
		keys = compressNumber(keys);
		let f = '';
		// f += parse.hex(note.color);

		const rgb: number[] = pColor.parse(note.color);
		f += rgb.reduce((acc, n) => acc + Math.round(n).toString(16), '');
		f += '+';
		if (note.label === note.note) {
			f += note.label;
		} else {
			f += note.label;
			f += '+';
			f += note.note;
		}

		f += '+';
		f += dec_to_b62('1' + keys);

		return f;
	});
	// d.unshift('1' + compressNumber(notes[0]?.keys.map((key) => key.duration?.toString()).join('')));
	// d.unshift(notes[0]?.keys.map((key) => key.duration?.toString()).join('='));

	const total: number[][] = [];
	notes[0]?.keys.forEach((key) => {
		if (total[total.length - 1]?.[0] == key.duration) {
			total[total.length - 1].push(key.duration);
		} else {
			total.push([key.duration]);
		}
	});
	d.unshift(
		total.reduce((acc, c) => [...acc, c.length >= 2 ? c.length + 'x' + c[0] : c], []).join('=')
	);

	return encodeURI(
		version + d.join('-').replace(/\[/gm, '(').replace(/\]/gm, ')').replace(/"/gm, "'")
	);
}
export function decode(encoded: string): INote[] {
	const parts = encoded.split('-');
	const notes: INote[] = [];

	const durations = parts
		.shift()
		.split('=')
		.reduce((acc, e) => {
			const s = e.split('x');
			if (s.length > 1) {
				acc = [...acc, ...Array(parseInt(s[0])).fill(parseFloat(s[1]))];
			} else {
				acc.push(parseFloat(s[0]));
			}
			return acc;
		}, []);
	const key_count = durations.length;

	parts.forEach((part) => {
		const elements = part.split('+');
		const note: INote = {} as INote;
		let raw_keys: string;
		let tmp_keys: number[] = [];
		const color = '#' + elements.shift();
		note.id = uniqueID();

		if (elements.length < 3) {
			note.label = elements[0];
			note.note = elements[0];
			raw_keys = elements[1];
		} else {
			note.label = elements[0];
			note.note = elements[1];
			raw_keys = elements[2];
		}

		raw_keys = b62_to_dec(raw_keys);
		raw_keys = raw_keys.slice(1);
		let keys: IKey[] = [];

		if (raw_keys.length === 1) {
			tmp_keys = Array(key_count).fill(parseInt(raw_keys[0]));
		} else {
			for (let i = 0; i < raw_keys.length; i++) {
				if (raw_keys[i] === '0' || raw_keys[i] === '1') {
					tmp_keys.push(parseInt(raw_keys[i]));
				} else {
					tmp_keys = [
						...tmp_keys,
						...Array(parseInt(raw_keys[i]) - 1).fill(parseInt(raw_keys[i + 1]))
					];
				}
			}
		}
		keys = tmp_keys.map((key) => {
			return { active: key === 1, duration: 1, id: uniqueID() };
		});
		keys.forEach((key, i) => {
			keys[i].duration = durations[i] || 1;
		});
		note.color = color;
		note.keys = keys;
		notes.push(note);
	});
	return notes;
}
