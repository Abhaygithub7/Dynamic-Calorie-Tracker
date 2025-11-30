import { GoogleGenAI, Type } from "@google/genai";

export const config = {
    runtime: 'edge',
};

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'Server configuration error: Missing API Key' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { prompt, schema } = await req.json();

        if (!prompt) {
            return new Response(JSON.stringify({ error: 'Missing prompt' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const genAI = new GoogleGenAI({ apiKey });
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const generationConfig: any = {
            responseMimeType: "application/json",
        };

        if (schema) {
            generationConfig.responseSchema = schema;
        }

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig,
        });

        const response = result.response;
        const text = response.text();

        return new Response(JSON.stringify({ text }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error('Gemini API Error:', error);
        return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
