import { describe, expect, it } from 'vitest';
import jwtUtils from '../src/utils/jwt-utils';

const context = {
	env: { jwt_secret_v2: 'test-secret' }
};

describe('jwtUtils', () => {
	it('adds an expiry when none is supplied', async () => {
		const token = await jwtUtils.generateToken(context, { userId: 1 });
		const [, payload] = token.split('.');
		const claims = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));

		expect(claims.exp).toBeGreaterThan(claims.iat);
	});

	it('rejects expired tokens', async () => {
		const token = await jwtUtils.generateToken(context, { userId: 1 }, -1);

		await expect(jwtUtils.verifyToken(context, token)).resolves.toBeNull();
	});
});
