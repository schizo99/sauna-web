/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	return {
		temp: await event.fetch(`/api/get`,
			{				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(r => r.json()),
		starts: await event.fetch(`/api/starts`,
			{				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			},
			).then(r => r.json())
	};
}
