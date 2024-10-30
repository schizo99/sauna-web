// src/routes/data-stream/+server.js
export function GET(event) {
    const headers = new Headers({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    const stream = new ReadableStream({
        async start(controller) {
            const interval = setInterval(async () => {
                try {
                    const data = {
                        temp: await event.fetch(`/api/get`,
                            {				method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': process.env.AUTHENTICATION
                                }
                            }).then(r => r.json()),
                        starts: await event.fetch(`/api/starts`,
                            {				method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': process.env.AUTHENTICATION
                                }
                            },
                            ).then(r => r.json())
                    };

                        // Attempt to enqueue, catching errors if the stream is closed
                        try {
                            controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
                        } catch (e) {
                            console.log("Stream closed, stopping data transmission:", e.message);
                            clearInterval(interval);
                        }
                    }
                 catch (error) {
                    try {
                        controller.enqueue(`data: ${JSON.stringify({ error: error.message })}\n\n`);
                    } catch (e) {
                        console.log("Stream closed, stopping error message transmission:", e.message);
                        clearInterval(interval);
                    }
                }
            }, 5000);

            return () => clearInterval(interval);
        }
    });
    return new Response(stream, { headers });
}