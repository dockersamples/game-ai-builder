import { useGameState } from "../GameState";
import { PlayScreen } from "./screens/PlayScreen";
import { StartScreen } from "./screens/StartScreen";
import { FinishScreen } from "./screens/FinishScreen";

export function ScreenContents() {
    const { state } = useGameState();

    if (state === "START") {
        return <StartScreen />;
    }

    if (state == "PLAY") {
        return <PlayScreen />;
    }

    if (state === "FINISH") {
        return <FinishScreen />;
    }

    return null;
}