declare interface IKey {
	duration: number;
	id: string;
	active: boolean;
}
declare interface INote {
	label: string;
	note: string | number;
	id: string;
	color: string;
	keys: IKey[];
}

declare type DndEvent = import('svelte-dnd-action').DndEvent;
declare namespace svelte.JSX {
	interface HTMLAttributes<T> {
		onconsider?: (event: CustomEvent<DndEvent> & { target: EventTarget & T }) => void;
		onfinalize?: (event: CustomEvent<DndEvent> & { target: EventTarget & T }) => void;
	}
}
