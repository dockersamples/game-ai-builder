import { useEffect } from "react";
import { useGameState } from "../../GameState";
import { Screen } from "./Screen";
import { ClickResultDisplay } from "./ClickResultDisplay";

export function PlayScreen() {
    const { handleClick, items, currentItemIndex } = useGameState();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (["1", "2", "3"].includes(e.key)) {
                handleClick(Number(e.key) - 1);
            }
        };
        
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    })

    return (
        <Screen>
            <ClickResultDisplay />
            <div>
                <h2>Click the item!</h2>
                <p>Current item: {items[currentItemIndex].prompt}</p>
            </div>
            <div>
                {items.map((item, index) => (
                    <button 
                        key={index} 
                        className="button" 
                        onClick={() => handleClick(index)}
                    >
                        ({ index + 1 }) {item.action}
                    </button>
                ))}
            </div>
        </Screen>
    )
}