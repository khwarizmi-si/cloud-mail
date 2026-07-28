import resendService from '../service/resend-service';
import app from '../hono/hono';
import { Resend } from 'resend';

app.post('/webhooks',async (c) => {
	try {
		const payload = await c.req.text();
		const body = new Resend().webhooks.verify({
			payload,
			headers: c.req.raw.headers,
			webhookSecret: c.env.resend_webhook_secret
		});
		await resendService.webhooks(c, body);
		return c.text('success', 200)
	} catch (e) {
		return c.text('Invalid webhook', 400)
	}
})
