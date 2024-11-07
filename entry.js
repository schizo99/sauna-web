import {server as app} from "./build/index.js"
import cron from "node-cron";


async function updateTelegramDate() {
    const req = await fetch('http://0.0.0.0:3000/api/telegram', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': process.env.AUTHENTICATION
        },
        body: JSON.stringify({ date: new Date().toISOString() })
    });
    let result = await req;
    if (!result.ok) {
        console.error('Failed to update telegram date', result);
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
    const json = await req.json()
    if (json.ok) {
        updateTelegramDate();
    } else {
        console.error('Message failed to send', json);
    }
}


async function checkDate() {
    const req = await fetch(`http://0.0.0.0:3000/api/telegram`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': process.env.AUTHENTICATION
        }
    });
    const date = await req.json();
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
    const telegramDate = new Date(date[0].telegram);
    if (telegramDate < sixHoursAgo) {
        sendSignal();
    }
}

const cronTask = cron.schedule("*/15 * * * * *", async () => {
    try {
        const req = await fetch(`http://0.0.0.0:3000/api/get`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.AUTHENTICATION
            }
        });
        const temp = await req.json();
        if (temp[0].temp > 7500) {
            console.log("Temp is over 80 degrees");
            checkDate();
        }
    } catch (error) {
        console.error("Error checking temp:", error);
    }
});

function shutdownGracefully() {
    cronTask.stop();

    app.server.close(() => {
        console.log("Server closed");
        process.exit(0);
    });
}
process.on("SIGINT", shutdownGracefully);
process.on("SIGTERM", shutdownGracefully);
