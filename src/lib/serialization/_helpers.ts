import anyBase from 'any-base';

export const dec_to_b62 = anyBase(
	anyBase.DEC,
	'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
);
export const b62_to_dec = anyBase(
	'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
	anyBase.DEC
);
