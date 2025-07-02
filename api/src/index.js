import express from 'express';
import fs from "fs";
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

const getHighScores = () => {
    if (!fs.existsSync('/data/high-scores.json')) {
        fs.writeFileSync('/data/high-scores.json', JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync('/data/high-scores.json', 'utf-8'));
}

const saveHighScores = (highScores) => {
    fs.writeFileSync('/data/high-scores.json', JSON.stringify(highScores, null, 2));
}

app.get('/api/high-scores', (req, res) => {
    res.json(getHighScores());
});

app.post("/api/high-scores", (req, res) => {
    const { name, score } = req.body;

    const highScores = getHighScores();

    const scoreIndex = highScores.findIndex(s => s.score < score);
    if (scoreIndex < 10) {
        highScores.splice(scoreIndex, 0, { name, score });
        if (highScores.length > 10) {
            highScores.pop();
        }
        saveHighScores(highScores);
        return res.status(201).json({ message: "High score added successfully!" });
    }
    return res.status(400).json({ message: "Score is not high enough to be added." });
});

app.post("/api/game-response", async (req, res) => {
    const {stats, type} = req.body;

    const systemPrompt = type === "roast" ? ROAST_PROMPT : PRAISE_PROMPT;
  
    const highScores = getHighScores();

    const userStats = [
        `The user had a total score of ${stats.score} points. They clicked a total of ${stats.total} times, giving an accuracy of ${Math.floor(stats.score/stats.total * 100)}%`,
        `The high scores range from ${highScores[0].score} to ${highScores[highScores.length - 1].score} points.`,
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