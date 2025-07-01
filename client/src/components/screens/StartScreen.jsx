import { useGameState } from "../../GameState";
import { Screen } from "./Screen";

export function StartScreen() {
    const { startGame } = useGameState();

    return (
        <Screen showScoreboard>
            <h2>Whalecome to the AI Builder!</h2>

            <p>Your job is to build a GenAI app. But, you to gather a few items for your app's stack.</p>

            <p>Simply press <strong>Start</strong> and click the matching icon.</p>

            <p>Each correct click gives you a point... so click quickly!</p>

            <button 
                className="button"
                onClick={() => startGame()}
            >
                Start
            </button>
        </Screen>
    );
}