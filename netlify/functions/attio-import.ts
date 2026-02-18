import { AttioClient } from "attio";

export default async (req: Request) => {
    // Check for API key
    const apiKey = process.env.ATTIO_API_KEY;
    if (!apiKey) {
        return new Response(JSON.stringify({ error: "Missing ATTIO_API_KEY environment variable" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }

    // Initialize the client
    const client = new AttioClient({
        api_key: apiKey,
    });

    try {
        // Determine what to do based on query params or body
        // For now, let's just list people as a test
        const url = new URL(req.url);
        const action = url.searchParams.get("action") || "list-people";
        let data;

        if (action === "list-people") {
            const result = await client.objects.list({
                object: "people",
                limit: 10,
            });
            data = result;
        } else if (action === "list-lists") {
            const result = await client.lists.list();
            data = result;
        } else {
            return new Response(JSON.stringify({ error: "Invalid action" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Return the data
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error: any) {
        console.error("Attio API Error:", error);
        return new Response(JSON.stringify({ error: error.message || "Failed to fetch from Attio" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};
