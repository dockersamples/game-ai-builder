import express from 'express';
import { OpenAI } from 'openai';
import { ROAST_PROMPT } from './prompts.mjs';
import { PRAISE_PROMPT } from './prompts.mjs';

const openAi = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "not-required",
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
});

const app = express();
app.use(express.json());
app.use(express.static('static'));

app.get('/api/high-scores', (req, res) => {
    res.json([
        { name: "ICE", score: 153 },
        { name: "HMH", score: 150 },
        { name: "HMH", score: 147 },
        { name: "HMH", score: 137 },
        { name: "rzn", score: 134 },
        { name: "THO", score: 128 },
        { name: "HMH", score: 127 },
        { name: "MSI", score: 127 },
        { name: "rzn", score: 126 },
        { name: "mes", score: 125 },
    ]);
});

app.post("/api/game-response", async (req, res) => {
    const {stats, type} = req.body;

    

    const systemPrompt = type === "roast" ? ROAST_PROMPT : PRAISE_PROMPT;
   
    const userStats = [
        `The user had a total score of ${stats.score} points out of ${stats.total} clicks, giving an accuracy of ${Math.floor(stats.score/stats.total * 100)}%`,
        `The previous high score is 72 points.`,
        `Click stats based on category:`,
        stats.items.map(item => `- ${item.action} - (correct: ${item.score}, incorrect: ${item.totalClicks - item.score})`).join("\n"),
    ].join("\n\n")

    try {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const stream = await openAi.chat.completions.create({
            model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
            messages: [
            { role: "system", content: systemPrompt },
            { 
                role: "user", 
                content: userStats
            }
            ],
            stream: true,
        });

        for await (const chunk of stream) {
            const content = chunk.choices?.[0]?.delta?.content;
            if (content) {
                res.write(content);
            }
        }
        res.end();
    } catch (error) {
        console.error("Error fetching game response:", error);
        res.status(500).json({ error: "Failed to fetch game response" });
    }
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

["SIGINT", "SIGTERM"].forEach(signal => {
    process.on(signal, () => {
        console.log(`Received ${signal}, shutting down gracefully...`);
        server.close(() => {
            console.log("Server closed");
            process.exit(0);
        });
    });
});