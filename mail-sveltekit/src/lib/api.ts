import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';

type WorkerResult<T> = {
	code: number;
	data?: T;
	message?: string;
};

export class ApiError extends Error {
	constructor(
		public readonly code: number,
		message = 'Permintaan tidak dapat diproses.'
	) {
		super(message);
	}
}

export function unwrapResult<T>(result: WorkerResult<T>): T {
	if (result.code !== 200) throw new ApiError(result.code, result.message);
	return result.data as T;
}

export function getToken() {
	return browser ? localStorage.getItem('token') : null;
}

export function setToken(token: string) {
	if (browser) localStorage.setItem('token', token);
}

export function clearToken() {
	if (browser) localStorage.removeItem('token');
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
	const headers = new Headers(init.headers);
	headers.set('accept-language', 'id');

	const token = getToken();
	if (token) headers.set('Authorization', token);
	if (init.body && !headers.has('content-type')) headers.set('content-type', 'application/json');

	const response = await fetch(`${env.PUBLIC_API_BASE_URL ?? ''}${path}`, { ...init, headers });
	if (!response.ok) throw new ApiError(response.status, 'Server tidak dapat dihubungi.');

	return unwrapResult<T>((await response.json()) as WorkerResult<T>);
}

export const login = (email: string, password: string) =>
	api<{ token: string }>('/login', { method: 'POST', body: JSON.stringify({ email, password }) });
