import { useCallback, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useGameState } from "../../GameState";
import { Screen } from "./Screen";

export function FinishScreen() {
    const { stats, resetGame } = useGameState();
    const [response, setResponse] = useState("");

    const getResponse = useCallback(async (roast = false) => {
        const response = await fetch(
            '/api/game-response',
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ stats, type: (roast) ? "roast": "praise" }),
            }
        );

        const reader = response.body
            .pipeThrough(new TextDecoderStream())
            .getReader();

        while (true) {
            const { value, done } = await reader.read()
            if (done) break
            console.log('Received: ', value)
            setResponse(prev => prev + value);
        }
    }, []);

    return (
        <Screen>
            <h2>Game over!</h2>

            <p>
                { Math.round(stats.score / stats.total * 100) }% accuracy
            </p>
            <p></p>
            <div>
                { response ? (
                    <div className="response">
                        <ReactMarkdown>{ response }</ReactMarkdown>
                    </div>
                ) : (
                    <>
                        <button className="button" onClick={() => getResponse(true)}>Roast me</button>
                        <button className="button" onClick={() => getResponse(false)}>Praise me</button>
                    </>
                )}
            </div>
            <button className="button" onClick={resetGame}>Restart</button>
        </Screen>
    )
}