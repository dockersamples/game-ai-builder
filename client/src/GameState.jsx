import { createContext, useCallback, useContext, useEffect, useState } from "react";

const GAME_SPEED_SCALE = 1;
const GAME_LENGTH = 30;
const CHANGE_RATE_PER_CLICK = 0.2; // 20% chance to change item on correct click

const ITEMS = [
    { 
        id: "model",
        action: "Choose a model",
        icon: "/assets/brain.svg",
    },
    {
        id: "tools",
        action: "Add tools",
        icon: "/assets/tool.svg",
    },
    {
        id: "prompt",
        action: "Craft a prompt",
        icon: "/assets/prompt.svg",
    },
    {
        id: "compose",
        action: "Package with Compose",
        icon: "/assets/file-code.svg",
    }
];

const DEFAULT_VALUE = {
    state: "START", /* START | PLAY | FINISH */
    stats: {
        score: 0,
        total: 0,
        clickStream: [], /* -1 for wrong click, +1 for correct click */
        items: ITEMS.map(item => ({ action: item.action, totalClicks: 0, score: 0 })),
    },
    timer: 30,
    items: ITEMS,
    currentItemIndex: 0,
    highScores: [],
    hasMadeFirstPoint: false,
    startGame: () => {},
    resetGame: () => {},
    handleClick: () => {},
    submitHighScore: (name, score) => {},
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
    const [hasMadeFirstPoint, setHasMadeFirstPoint] = useState(false);

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
        setCurrentItemIndex(pickNewItemIndex(ITEMS));
    }, [setState, setTimer]);

    const resetGame = useCallback(() => {
        setState("START");
        setHasMadeFirstPoint(false);
        setStats({
            total: 0,
            score: 0,
            clickStream: [],
            items: ITEMS.map(item => ({ action: item.action, total: 0, score: 0, }))
        })
    }, [setState, setStats]);

    useEffect(() => {
        if (stats.total === 1) {
            setHasMadeFirstPoint(true);
            setTimer(GAME_LENGTH);
        }
    }, [stats, setHasMadeFirstPoint]);

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

            if (currentIndex === itemIndex && Math.random() < CHANGE_RATE_PER_CLICK) {
                return pickNewItemIndex(ITEMS);
            }
            return currentIndex;
        });
    }, [setStats, setCurrentItemIndex, setHasMadeFirstPoint]);

    useEffect(() => {
        if (state === "START" || !hasMadeFirstPoint) return;
        
        if (timer <= 0) {
            setState("FINISH");
            return;
        }

        const t = setTimeout(() => setTimer(t => t - 1), 1000 * GAME_SPEED_SCALE);
        return () => clearTimeout(t);
    }, [state, timer, setState, hasMadeFirstPoint]);

    const submitHighScore = useCallback(async (name, score) => {
        await fetch("/api/high-scores", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, score }),
        });
    }, []);

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
            hasMadeFirstPoint,
            
            startGame, 
            resetGame,
            handleClick,
            submitHighScore,
        }}>
            { children }
        </GameStateContext.Provider>
    );
}

export const useGameState = () => useContext(GameStateContext);