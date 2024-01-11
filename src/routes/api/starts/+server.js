import influx from '$lib/influx';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, fetch }) {
    let result = await influx.query(`
    SELECT LAST("temp") AS last_temp
    FROM "temperatures" WHERE "temp" >= 7000
    GROUP BY time(1d) fill(none)
  `).catch(err => {
        console.log(err)
        return "bajs"
    })

    return new Response(JSON.stringify(result))
}