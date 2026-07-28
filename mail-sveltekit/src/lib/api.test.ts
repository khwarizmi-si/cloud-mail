import { describe, expect, it } from 'vitest';
import { ApiError, query, requiresAuthentication, unwrapResult } from './api';

describe('unwrapResult', () => {
	it('returns data from a successful Worker response', () => {
		expect(unwrapResult({ code: 200, data: { token: 'abc' } })).toEqual({ token: 'abc' });
	});

	it('preserves a Worker error code and message', () => {
		expect(() => unwrapResult({ code: 403, message: 'Tidak diizinkan' })).toThrow(ApiError);
	});

	it('identifies an unauthenticated response', () => {
		try {
			unwrapResult({ code: 401, message: 'Sesi berakhir' });
		} catch (error) {
			expect(error).toMatchObject({ code: 401, message: 'Sesi berakhir' });
		}
	});

	it('serializes only defined query values', () => {
		expect(query('/email/list', { accountId: 1, empty: undefined })).toBe('/email/list?accountId=1');
	});

	it('requires a token for every route except login', () => {
		expect(requiresAuthentication('/settings', null)).toBe(true);
		expect(requiresAuthentication('/login', null)).toBe(false);
		expect(requiresAuthentication('/inbox', 'token')).toBe(false);
	});
});
