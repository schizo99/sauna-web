
/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	return {
		temp: await event.fetch(`/api/temps`,
			{
				method: 'POST',
				body: JSON.stringify({ days: 1, hours: 6 }),
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(r => r.json())
	};
}
