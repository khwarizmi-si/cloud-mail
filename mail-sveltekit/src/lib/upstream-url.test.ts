import { describe, expect, it } from 'vitest';
import { upstreamUrl } from './upstream-url';

describe('upstreamUrl', () => {
	it('preserves the API path and query on the fixed upstream origin', () => {
		expect(upstreamUrl('https://preview.pages.dev/api/email/list?size=50'))
			.toBe('https://mail.khwarizmi.co.id/api/email/list?size=50');
	});

	it('never treats a request path as a replacement hostname', () => {
		expect(upstreamUrl('https://preview.pages.dev//other-host/login'))
			.toBe('https://mail.khwarizmi.co.id//other-host/login');
	});
});
