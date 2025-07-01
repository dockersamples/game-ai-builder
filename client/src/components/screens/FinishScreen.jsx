import { useGameState } from "../../GameState";
import { Screen } from "./Screen";
import { FinishOptions } from "./FinishOptions";
import { useState } from "react";

export function FinishScreen() {
    const { stats, highScores, submitHighScore } = useGameState();
    const [evaluatedHighScore, setEvaluatedHighScore] = useState(false);
    const [name, setName] = useState("");

    const gotHighScore = stats.score > 0 && highScores.some(score => score.score < stats.score);

    const handleHighScoreSubmission = async (e) => {
        e.preventDefault();
        submitHighScore(name, stats.score);
        setEvaluatedHighScore(true);
    };

    return (
        <Screen>
            { stats.total === 0 ? (
                <h2>It looks like you got zero points!</h2>
            ) : (
                <h2>You got {stats.score} points! ({ Math.round(stats.score / stats.total * 100) }% accuracy)</h2>
            )}

            <p></p>
            { gotHighScore && !evaluatedHighScore ? (
                <div>
                    <h3>Congratulations!</h3>
                    <p>You got a high score!</p>
                    <form onSubmit={handleHighScoreSubmission}>
                        <input 
                            type="text" 
                            id="yourName"
                            className="input"
                            placeholder="Your initials" 
                            maxLength={3}
                            value={name}
                            onChange={e => setName(e.target.value)}
                            autoComplete="off"
                            data-1p-ignore="true"
                        />
                        <button 
                            className="button is-small" 
                            id="submitName"
                            disabled={!name.trim()}
                            type="submit"
                        >Submit</button>
                        <button 
                            className="button is-small"
                            onClick={() => setEvaluatedHighScore(true)}
                        >Skip</button>
                    </form>
                </div>
            ) : (
                <FinishOptions />
            )}
        </Screen>
    )
}