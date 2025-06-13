import { createContext, useCallback, useContext, useEffect, useState } from "react";

const GAME_SPEED_SCALE = 1;
const GAME_LENGTH = 30;

const ITEMS = [
    { 
        prompt: "Secrets",
        action: "Scan and block"
    },
    {
        prompt: "Tools have too much access",
        action: "Run in a container",
    },
    {
        prompt: "Tool sprawl",
        action: "Use Compose",
    }
];

const DEFAULT_VALUE = {
    state: "START", /* START | PLAY | FINISH */
    stats: {
        score: 0,
        total: 0,
        clickStream: [], /* -1 for wrong click, +1 for correct click */
        items: ITEMS.map(item => ({ prompt: item.prompt, totalClicks: 0, score: 0 })),
    },
    timer: 30,
    items: ITEMS,
    currentItemIndex: 0,
    highScores: [],
    startGame: () => {},
    resetGame: () => {},
    handleClick: () => {},

};

const GameStateContext = createContext(DEFAULT_VALUE);

function pickNewItemIndex(items) {
    return Math.floor(Math.random() * items.length);
}

export function GameStateProvider({ children }) {
    const [bootstrapped, setBootstrapped] = useState(false);
    const [stats, setStats] = useState(DEFAULT_VALUE.stats);
    const [timer, setTimer] = useState(0);
    const [highScores, setHighScores] = useState(DEFAULT_VALUE.highScores);
    const [state, setState] = useState("START");
    const [currentItemIndex, setCurrentItemIndex] = useState(0);

    useEffect(() => {
        fetch("/api/high-scores")
            .then(response => response.json())
            .then(data => {
                setHighScores(data);
                setBootstrapped(true);
            })
            .catch(error => {
                console.error("Error fetching high scores:", error);
                alert("Failed to bootstrap. Please try again later.");
            });
    }, []);

    const startGame = useCallback(() => {
        setState("PLAY");
        setTimer(GAME_LENGTH);
        setCurrentItemIndex(pickNewItemIndex(ITEMS));
    }, [setState, setTimer]);

    const resetGame = useCallback(() => {
        setState("START");
        setLastClickResult(0);
        setStats({
            total: 0,
            score: 0,
            clickStream: [],
            items: ITEMS.map(item => ({ prompt: item.prompt, total: 0, score: 0, }))
        })
    }, [setState, setStats]);

    const handleClick = useCallback((itemIndex) => {

        setCurrentItemIndex(currentIndex => {
            setStats(prevStats => {
                const newStats = { ...prevStats };
                newStats.total++;
                newStats.items[currentIndex].total++;
                newStats.clickStream.push((currentIndex === itemIndex) ? 1 : -1);

                if (currentIndex === itemIndex) {
                    newStats.score++;
                    newStats.items[currentIndex].score++;
                }
                return newStats;
            });

            if (currentIndex === itemIndex) {
                return pickNewItemIndex(ITEMS);
            }
            return currentIndex;
        });
    }, [setStats, setCurrentItemIndex]);

    useEffect(() => {
        if (state === "START") return;
        
        if (timer <= 0) {
            setState("FINISH");
            return;
        }

        const t = setTimeout(() => setTimer(t => t - 1), 1000 * GAME_SPEED_SCALE);
        return () => clearTimeout(t);
    }, [state, timer, setState]);

    if (!bootstrapped) {
        return <h2 style={{marginTop: "5rem"}}>Starting game...</h2>
    }

    return (
        <GameStateContext.Provider value={{ 
            stats,
            timer, 
            highScores, 
            state, 
            items: DEFAULT_VALUE.items,
            currentItemIndex,
            
            startGame, 
            resetGame,
            handleClick,
        }}>
            { children }
        </GameStateContext.Provider>
    );
}

export const useGameState = () => useContext(GameStateContext);