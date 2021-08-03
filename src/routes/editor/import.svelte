<script lang="ts">
	import { notes as noteStore } from '$lib/stores';
	import { uniqueID } from '$lib/helpers';
	import { default_key } from '$lib/stores/notes';

	import LinearProgress from '@smui/linear-progress';
	import { goto } from '$app/navigation';
	import { decode, encode } from '$lib/serialization';

	const types = /(\.mxl|\.musicxml|\.xml)$/;
	let dragging = false;
	let files: FileList;
	let progress = 0;

	function dragenter(event: DragEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		for (let index = 0; index < event.dataTransfer.items.length; ++index) {
			let item = event.dataTransfer.items[index];
			dragging = item.kind === 'file';
		}
	}
	function dragleave(event: DragEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		if ((event.relatedTarget as HTMLInputElement)?.tagName?.toLowerCase() !== 'input') {
			dragging = false;
		}
	}
	function drop(event: DragEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		files = event.dataTransfer.files;
	}

	const durationsMap = new Map<string, number>([
		['64th', 0.0625],
		['32d', 0.125],
		['16th', 0.25],
		['eighth', 0.5],
		['quarter', 1],
		['half', 2],
		['whole', 4]
	]);
	const altersMap = new Map<string, string>([
		['-2', 'BB'],
		['-1', 'B'],
		['0', ''],
		['1', '#'],
		['2', 'x']
	]);
	async function generateNotesFromXML(xml: Document) {
		progress = 0.2;
		const title = xml.querySelector('work-title').textContent;
		progress = 0.2;

		const parts = xml.querySelectorAll('part');
		const mesures = xml.querySelectorAll('measure');
		let notes: INote[] = [];
		let durations: number[] = [];
		let totalDuration = 0;
		let keysKount = 0;
		mesures.forEach((mesure, i) => {
			progress = i / mesures.length;

			let newPart = mesure.querySelector('words') != null;
			if (newPart) {
				let encoded = encode(notes);
				decode(encoded);
				let url = document.URL.replace('/import', '?notes=' + encoded);
				window.open(url, '_blank');
				notes = [];
				durations = [];
				totalDuration = 0;
				keysKount = 0;
			}

			const notesElems = mesure.querySelectorAll('note');

			notesElems.forEach((noteElem) => {
				let voice = noteElem.querySelector('voice')?.textContent;
				if (voice == '2') return;

				let type = noteElem.querySelector('type').textContent;
				let duration = durationsMap.get(type);
				durations[keysKount] = duration;
				let rest = noteElem.querySelector('rest') != null;
				if (rest) {
					notes.forEach((note) => {
						note.keys[keysKount] = default_key();
						note.keys[keysKount].duration = duration;
					});
					keysKount++;
					return;
				}
				let step = noteElem.querySelector('step').textContent;
				let alter = noteElem.querySelector('alter')?.textContent;
				let octave = noteElem.querySelector('octave').textContent || '0';
				let value = step + (altersMap.get(alter) || '') + octave;

				let newNote = notes.find((note) => note.note === value);
				if (!newNote) {
					newNote = {
						id: uniqueID(),
						label: value,
						color: '#00CDFF',
						note: value,
						keys: Array(keysKount)
							.fill(null)
							.map((e, i) => ({
								active: false,
								id: uniqueID(),
								duration: durations[i]
							}))
					};
					notes.push(newNote);
				}
				notes.forEach((note) => {
					note.keys[keysKount] = default_key();
					note.keys[keysKount].duration = duration;
				});
				newNote.keys[keysKount].active = true;

				keysKount++;
			});
		});
		$noteStore = notes;
		goto('/editor');
	}

	async function handleFile(file: File) {
		progress = 0.1;
		let text = await file.text();
		const parser = new DOMParser();
		if (file.name.endsWith('.xml') || file.name.endsWith('.musicxml')) {
			generateNotesFromXML(parser.parseFromString(text, 'text/xml'));
		}
	}
	$: {
		if (files?.[0]?.name?.match(types)) {
			handleFile(files[0]);
		}
	}
</script>

<div
	on:drop|preventDefault={drop}
	on:dragenter|preventDefault={dragenter}
	on:dragleave|preventDefault={dragleave}
	class="drop"
	class:dragging
	class:wrong={files?.[0] && !files[0].name.match(types)}
	class:succes={files?.[0] && files[0].name.match(types)}
>
	<input type="file" bind:files />
	{#if files?.[0] && !files[0].name.match(types)}
		<p>
			file {files[0].name} has unuported type <br />
			we support <strong>.mxl</strong> and <strong>.musicxml.xml</strong>
		</p>
	{:else}
		<p>
			drop a music file here or click to select a file <br />

			we support <strong>.mxl</strong> and <strong>.musicxml.xml</strong>
		</p>
	{/if}
</div>
<LinearProgress {progress} closed={!(progress > 0)} />

<style lang="scss">
	.drop {
		display: grid;
		place-items: center;
		position: absolute;
		inset: 1em;
		border: 4px dashed #ddda;
		border-radius: 5px;
		input {
			cursor: pointer;
			position: absolute;
			inset: 0;
			width: 100%;
			opacity: 0;
		}
		&.dragging,
		&:active {
			border-color: rgba(88, 88, 88, 0.667);
		}
		&.wrong {
			border-color: hsla(0, 100%, 35%, 0.667);
		}
		&.succes {
			border-color: hsla(111, 100%, 35%, 0.667);
		}
	}
</style>
