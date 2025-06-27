import { useGameState } from "../GameState";

export function GameAnswers() {
    const { state, items, handleClick } = useGameState();

    return (
        <nav className={`${ state !== 'PLAY' ? 'waiting' : '' } answers`}>
            { items.map((item, index) => (
                <a key={item.id} id={ item.id } className="button" onClick={() => handleClick(index)}> 
                    <img src={item.icon} />
                    <em>
                        { item.action }
                    </em> 
                </a> 
            ))}
        </nav>
    );
}