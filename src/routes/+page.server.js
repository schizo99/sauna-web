/** @type {import('./$types').PageServerLoad} */
export async function load({ depends, event, fetch }) {
	depends('api:data');
	//console.log('Load API data');

	const temp = await fetch(`/api/get`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': process.env.AUTHENTICATION
		}
	})

	const starts = await fetch(`/api/starts`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': process.env.AUTHENTICATION
			}
		},
	);
	return {
		temp: await temp.json(),
		starts: await starts.json()
	};
}
