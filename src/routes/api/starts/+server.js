import { json } from '@sveltejs/kit';
import process from 'process';
const host = process.env.API_HOST || 'localhost';
/** @type {import('./$types').RequestHandler} */
export async function GET({ params, fetch }) 
{
    return await fetch(`http://${host}/starts/`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});
}