import { Fragment } from "react";
import { useGameState } from "../GameState";

export function Scoreboard() {
    const { highScores } = useGameState();

    return (
        <div className="highscore" id="highScores"> 
            <h3>High Scores</h3>

            { highScores.length === 0 && (
                <p>No high scores yet!</p>
            )}

            <dl id="highScoresList">
                { highScores.map((score, index) => (
                    <Fragment key={index}>
                        <dt>{ score.name }</dt>
                        <dd>{score. score }</dd>
                    </Fragment>
                ))}
            </dl> 
        </div>
    );
}