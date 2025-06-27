import { useGameState } from "../../GameState";
import { Screen } from "./Screen";

export function StartScreen() {
    const { startGame } = useGameState();

    return (
        <Screen>
            <h2>Whalecome to the AI Builder!</h2>

            <p>Your job is to build a GenAI app, which means collecting all of the components needed.</p>

            <p>Each correct answer gives you a point. Go as quickly as you can!</p>

            <button 
                className="button"
                onClick={() => startGame()}
            >
                Start
            </button>
        </Screen>
    );
}