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
