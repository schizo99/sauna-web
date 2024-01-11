export async function handle({ event, resolve }) {
	if (event.url.pathname.startsWith('/api')) {
		const auth = process.env.AUTHENTICATION || 'false';
		const authHeader = event.request.headers.get('authorization');
		if (!authHeader || authHeader !== auth) {
			let response = new Response(JSON.stringify({ Error: "Unauthorized" }), { status: 401, headers: { 'Content-Type': 'application/json' } });
			return response;
		}
		if (event.request.method === 'OPTIONS') {
			return new Response(null, {
			  headers: {
				'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': '*',
			  }
			});
		  }
	}
	const response = await resolve(event);
	if (event.url.pathname.startsWith('/api')) {
		response.headers.append('Access-Control-Allow-Origin', `*`);
	}
	return response;
}