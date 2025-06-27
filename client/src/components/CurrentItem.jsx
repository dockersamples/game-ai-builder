import { useGameState } from "../GameState";

export function CurrentItem() {
    const { state, items, currentItemIndex } = useGameState();

    const selectedItem = items[currentItemIndex];

    if (state !== "PLAY") {
        return null;
    }

    return (
        <div 
            class={`cat-bubble ${selectedItem.id}`} 
            style={state === "PLAY" || 1 === 1 ? { display: "block" } : {}}
        ></div>
    );
}