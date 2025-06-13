import { useGameState } from "../../GameState";
import { Screen } from "./Screen";

export function StartScreen() {
    const { startGame } = useGameState();

    return (
        <Screen>
            <h2>Whalecome to AI Defender!</h2>

            <p>Your job is to build a GenAI app, but block all of the security issues that might arise on the way.</p>

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