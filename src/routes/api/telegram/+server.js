import influx from '$lib/telegram';

export async function POST() {
  let result = await influx.query(`select last("date") as telegram from telegram`).catch(err => {
    console.log(err)
    return "bajs"
  })
  const date = await result;
  const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
  const telegramDate = new Date(date[0].telegram);
  if (telegramDate < sixHoursAgo) {
    sendSignal();
  }
  return new Response("OK")
}

async function updateTelegramDate() {
  try {
    const date = new Date().toISOString();
    await influx.writePoints([
      {
        measurement: 'telegram',
        fields: { date },
      }
    ])
  } catch (err) {
    console.log("Failed setting telegramdate", err)
    return "bajs"
  }
}


async function sendSignal() {
  const req = await fetch(`https://api.telegram.org/bot${process.env.TOKEN}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: process.env.CHAT_ID,
      text: `Sauna temp has passed: 75°C`
    })
  });
  const result = await req;

  if (result.ok) {
    updateTelegramDate();
  } else {
    console.error('Message failed to send', result);
  }
}
