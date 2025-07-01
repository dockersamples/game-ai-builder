import { useGameState } from "../../GameState";
import { Screen } from "./Screen";

export function StartScreen() {
    const { startGame } = useGameState();

    return (
        <Screen>
            <h2>Whalecome to the AI Builder!</h2>

            <p>Your job is to build a GenAI app. But, you need a few things in your stack.</p>

            <p>You will be presented with an icon representing a stack component.</p>
            
            <p>Your job is to click the matching button to add it to your stack.</p>

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