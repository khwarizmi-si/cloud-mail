const apiOrigin = 'https://mail.khwarizmi.co.id';

export function upstreamUrl(requestUrl: string) {
	const source = new URL(requestUrl);
	const upstream = new URL(apiOrigin);
	upstream.pathname = source.pathname;
	upstream.search = source.search;
	return upstream.toString();
}
