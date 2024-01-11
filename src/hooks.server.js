export async function handle({ event, resolve }) {
	if (event.url.pathname.startsWith('/api')) {
		const auth = process.env.AUTHENTICATION || 'false';
		const authHeader = event.request.headers.get('authorization');
		if (!authHeader || authHeader !== auth) {
			let response = new Response(JSON.stringify({Error: "Unauthorized"}), { status: 401, headers: { 'Content-Type': 'application/json' } });
			return response;
		}
	}
	const response = await resolve(event);
	return response;
}