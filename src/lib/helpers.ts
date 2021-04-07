export function uniqueID(): string {
	return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
}
export function map(
	x: number,
	in_min: number,
	in_max: number,
	out_min: number,
	out_max: number
): number {
	return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}
