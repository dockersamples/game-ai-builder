import { useGameState } from "../GameState";

export function CurrentScore() {
    const { stats, timer } = useGameState();

    return (
        <section className="score"> 
            <p>Score: { stats.score }</p> 
            <p>Timer: { timer }</p>
        </section>
    );
}