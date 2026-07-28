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

export function query(path: string, params: Record<string, string | number | boolean | undefined>) {
	const search = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined) search.set(key, String(value));
	}
	return `${path}?${search}`;
}

export type Account = { accountId: number; email: string; allReceive: number; forwardEmail?: string };
export type Mail = {
	emailId: number;
	name?: string;
	sendEmail?: string;
	subject?: string;
	text?: string;
	createTime?: string;
	unread?: number;
};

export type MailList = { list: Mail[]; total: number; latestEmail: Mail };

export const login = (email: string, password: string) =>
	api<{ token: string }>('/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const listAccounts = () => api<Account[]>(query('/account/list', { accountId: 0, size: 50 }));

export const listInbox = (account: Account) =>
	api<MailList>(query('/email/list', {
		accountId: account.accountId,
		allReceive: account.allReceive,
		emailId: 0,
		timeSort: 0,
		size: 50,
		type: 0
	}));

export const markRead = (emailIds: number[]) =>
	api<void>('/email/read', { method: 'PUT', body: JSON.stringify({ emailIds }) });

export type SendMail = {
	accountId: number;
	sendEmail: string;
	name?: string;
	receiveEmail: string[];
	subject: string;
	content: string;
	text: string;
	sendType: '' | 'reply' | 'forward';
	emailId: number;
	attachments: unknown[];
};

export const sendMail = (mail: SendMail) => api<Mail[]>('/email/send', { method: 'POST', body: JSON.stringify(mail) });
