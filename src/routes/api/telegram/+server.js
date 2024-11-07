import influx from '$lib/telegram';

export async function POST({request}) {
    const { date } = await request.json();
    let result = await influx.writePoints([
        {
          measurement: 'telegram',
          fields: { date },
        }
      ])
      .catch(err => {
        console.log(err)
        return "bajs"
    })

    return new Response(JSON.stringify(result))
}

export async function GET() {
  let result = await influx.query(`
  select last("date") as telegram from telegram
`).catch(err => {
      console.log(err)
      return "bajs"
  })

  return new Response(JSON.stringify(result))
}