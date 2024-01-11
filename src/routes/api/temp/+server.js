import influx from '$lib/influx';

export async function POST({request}) {
    const { temp } = await request.json();
    let result = await influx.writePoints([
        {
          measurement: 'temperatures',
          fields: { temp },
        }
      ])
      .catch(err => {
        console.log(err)
        return "bajs"
    })

    return new Response(JSON.stringify(result))
}