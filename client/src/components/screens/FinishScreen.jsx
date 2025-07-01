import { useCallback, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useGameState } from "../../GameState";
import { Screen } from "./Screen";

export function FinishScreen() {
    const { stats, resetGame } = useGameState();
    const [response, setResponse] = useState("");
    const [generatingResponse, setGeneratingResponse] = useState(false);
    const [beenRoasted, setBeenRoasted] = useState(false);
    const [beenPraised, setBeenPraised] = useState(false);

    const getResponse = useCallback(async (roast = false) => {
        if (roast) setBeenRoasted(true);
        else setBeenPraised(true);
        
        setResponse("");
        setGeneratingResponse(true);

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

        setGeneratingResponse(false);
    }, []);

    return (
        <Screen>
            { stats.total === 0 ? (
                <h2>It looks like you got zero points!</h2>
            ) : (
                <h2>You got {stats.score} points! ({ Math.round(stats.score / stats.total * 100) }% accuracy)</h2>
            )}

            <p></p>
            <div>
                { generatingResponse && !response && (
                    <div className="loading">
                        <p>Generating response...</p>
                        <div className="spinner"></div>
                    </div>
                )}

                { response && (
                    <div className="response">
                        <ReactMarkdown>{ response }</ReactMarkdown>
                    </div>
                )}

                <div>
                    { !beenRoasted && (
                        <button className="button alt" onClick={() => getResponse(true)}>Roast me</button>
                    )}
                    { !beenPraised && (
                        <button className="button alt" onClick={() => getResponse(false)}>Praise me</button>
                    )}

                    <button className="button" onClick={resetGame}>Restart</button>
                </div>
            </div>
        </Screen>
    )
}