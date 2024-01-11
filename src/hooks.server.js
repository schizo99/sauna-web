export async function handle({ event, resolve }) {
	if (event.url.pathname.startsWith('/api')) {
		const auth = process.env.AUTHENTICATION || 'false';
		const authHeader = event.request.headers.get('authorization');
		if (!authHeader || authHeader !== auth) {
			let response = new Response(JSON.stringify({ Error: "Unauthorized" }), { status: 401, headers: { 'Content-Type': 'application/json' } });
			return response;
		}
		if (event.request.method === 'POST') {
			const response = await resolve(event);
			response.headers.append('Access-Control-Allow-Origin', '*');
			response.headers.append('Access-Control-Allow-Methods', 'GET, POST');
			response.headers.append('Access-Control-Allow-Headers', '*');
			return response
		}
	}
	const response = await resolve(event);
	if (event.url.pathname.startsWith('/api')) {
        response.headers.append('Access-Control-Allow-Origin', `*`);
  }
	return response;
}