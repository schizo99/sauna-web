import {server as app} from "./build/index.js"
import cron from "node-cron";


async function sendSignal() {
    const req = await fetch(`http://0.0.0.0:3000/api/telegram`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': process.env.AUTHENTICATION
        }
    });
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
            console.log(new Date().toISOString(), "Temp is over 75 degrees");
            sendSignal();
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
