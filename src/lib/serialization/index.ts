export { encode } from './v1';
import { decode as decode_v1 } from './v1';

export function decode(encoded: string): { data?: INote[]; error?: string } {
	const version = encoded[0];
	if (version == '1') {
		return { data: decode_v1(encoded.slice(1)) };
	} else {
		return { error: 'unknown version' };
	}
}
