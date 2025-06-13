import { useEffect, useState } from "react";
import { useGameState } from "../../GameState";

function ClickResult({ result }) {
    const [hiding, setHiding] = useState(false);
    const [hide, setHide] = useState(false);
    
    useEffect(() => {
        const t = setTimeout(() => setHiding(true), 200);
        return () => clearTimeout(t);
    }, [setHiding]);
    
    useEffect(() => {
        const t = setTimeout(() => setHide(true), 500);
        return () => clearTimeout(t);
    }, [setHide]);

    if (hide) return null;

    return (
        <span className={`click-result ${hiding ? " hiding" : ""}`}>
            { result > 0 ? "✅" : (result < 0 ? "❌" : "") }
        </span>
    );
}

export function ClickResultDisplay() {
    const { stats } = useGameState();

    return (
        <div id="results">
            { stats.clickStream.map((result, index) => (
                <ClickResult key={index} result={result} />
            )) }
        </div>
    )
}