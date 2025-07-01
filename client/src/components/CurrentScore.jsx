import { useGameState } from "../GameState";

export function CurrentScore() {
    const { state, stats, timer } = useGameState();

    if (state === "START")
        return null;

    return (
        <section className="score"> 
            <p>Score: { stats.score }</p> 
            <p>Timer: { timer }</p>
        </section>
    );
}
