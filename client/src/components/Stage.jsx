import { useGameState } from "../GameState";
import { CurrentItem } from "./CurrentItem";
import { GameAnswers } from "./GameAnswers";
import { Scoreboard } from "./Scoreboard";
import { ScreenContents } from "./ScreenContents";

function getGameStateClass(state) {
    switch (state) {
        case "START":
            return "waiting";
        case "PLAY":
            return "gametime";
        case "FINISH":
            return "waiting";
        default:
            return "";
    }
}

export function Stage() {
    const { state } = useGameState();

    const gameStateClass = getGameStateClass(state);

    return (
        <section id="whiskerStage" className={`fullscreen stage ${gameStateClass}`}>
            <ScreenContents />
            <GameAnswers />
            <CurrentItem />
        </section>
    );
}