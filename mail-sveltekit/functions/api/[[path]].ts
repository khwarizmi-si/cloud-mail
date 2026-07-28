import { upstreamUrl } from '../../src/lib/upstream-url';

type PagesContext = {
	request: Request;
};

export async function onRequest({ request }: PagesContext) {
	const headers = new Headers(request.headers);
	headers.delete('host');
	headers.delete('origin');
	headers.delete('referer');

	return fetch(upstreamUrl(request.url), {
		method: request.method,
		headers,
		body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
		cache: 'no-store',
		redirect: 'manual'
	});
}
