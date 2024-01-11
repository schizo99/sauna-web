export async function load({fetch, locals, request}) {
	return {
		temp: await fetch(`/api/temps`,
			{
				method: 'POST',
				body: JSON.stringify({ days: 0}),
				headers: {
					'Content-Type': 'application/json',
					'Authorization': process.env.AUTHENTICATION
				}
			}).then(r => r.json())
	};
}

export const actions = {
	getdays: async ({fetch, request, locals}) => {
        const data = await request.formData();
        const days = data.get('days');
		return {
            temp: await fetch(`/api/temps`,
                {
                    method: 'POST',
                    body: JSON.stringify({days}),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': process.env.AUTHENTICATION
                    }
                }).then(r => r.json())
        };
    }
};