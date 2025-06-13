import { Fragment } from "react";
import { useGameState } from "../GameState";

export function Scoreboard() {
    const { highScores } = useGameState();

return null;

    return (
        <aside className="highscore" id="highScores"> 
            <h2>High Scores</h2> 
            <dl id="highScoresList">
                { highScores.map((score, index) => (
                    <Fragment key={index}>
                        <dt>{ score.name }</dt>
                        <dd>{score. score }</dd>
                    </Fragment>
                ))}
            </dl> 
        </aside>
    );
}