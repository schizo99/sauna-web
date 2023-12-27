import { json } from '@sveltejs/kit';
import process from 'process';
const host = process.env.API_HOST || 'localhost';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, fetch }) {
	const { days, hours } = await request.json();
	return await fetch(`http://${host}/temps/${days}/${hours}`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
}