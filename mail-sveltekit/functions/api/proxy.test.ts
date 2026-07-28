import { afterEach, describe, expect, it, vi } from 'vitest';
import { onRequest } from './[[path]]';

afterEach(() => vi.unstubAllGlobals());

describe('Pages API proxy', () => {
	it('forwards requests to the fixed mail origin without caching private data', async () => {
		const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
		vi.stubGlobal('fetch', fetchMock);

		await onRequest({
			request: new Request('https://preview.pages.dev/api/email/list?size=50', {
				headers: { authorization: 'test-token', origin: 'https://preview.pages.dev' }
			})
		});

		expect(fetchMock).toHaveBeenCalledWith(
			'https://mail.khwarizmi.co.id/api/email/list?size=50',
			expect.objectContaining({ cache: 'no-store', redirect: 'manual' })
		);

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		const headers = init.headers as Headers;
		expect(headers.get('authorization')).toBe('test-token');
		expect(headers.get('origin')).toBeNull();
	});
});
