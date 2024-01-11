import influx from '$lib/influx';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, fetch }) {
	let { days } = await request.json();
    if (!days) days=0;
    let timePeriod = `${days}d`;
    if (days < 1) {
        days = 1;
        timePeriod = `6h`;
    }
    const aggregation = 10 * days;
    let result = await influx.query(`
    SELECT FIRST(temp) as temp
	FROM temperatures where time > now() - ${timePeriod}
	GROUP BY time(${aggregation}s) fill(none)
  `).catch(err => {
        console.log(err)
        return "bajs"
    })

    return new Response(JSON.stringify(result))
}

//TODO filter  närliggande values

// const getTemps = (req, res) => {
// 	const days = req.params.days;
// 	const hours = req.params.hours
// 	const aggregation = 10 * days;
// 	influx.query(`
// 	  SELECT FIRST(temp) as temp
// 	  FROM temperatures where time > now() - ${days}d
// 	  GROUP BY time(${aggregation}s) fill(none)
// 	`).then(result => {
// 	  res.json(result)
// 	}).catch(err => {
// 	  res.status(500).send(err.stack)
// 	})
//   }