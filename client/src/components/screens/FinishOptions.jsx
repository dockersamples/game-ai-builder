import { useCallback, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useGameState } from "../../GameState";

export function FinishOptions() {
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
            if (done) break;
            setResponse(prev => prev + value);
        }

        setGeneratingResponse(false);
    }, []);
    

    return (
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
                    <button className="button alt is-small" onClick={() => getResponse(true)}>Roast me</button>
                )}
                { !beenPraised && (
                    <button className="button alt is-small" onClick={() => getResponse(false)}>Praise me</button>
                )}

                <button className="button is-small" onClick={resetGame}>Restart</button>
            </div>
        </div>
    );
}