import influx from '$lib/influx';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
    let result = await influx.query(`
    select last("temp") as temp from temperatures
  `).catch(err => {
        console.log(err)
        return "bajs"
    })

    return new Response(JSON.stringify(result))
}