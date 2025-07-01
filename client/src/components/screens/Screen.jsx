import { Scoreboard } from "../Scoreboard";

export function Screen({ children, align = "center", showScoreboard = false }) {
    return (
        <div className="modal monitor is-active">
            <div className="modal-content">
                <div className={`box intro align-${align}`}>                    
                    { children }

                </div>
                { showScoreboard && (
                    <Scoreboard />
                )}
            </div>
        </div>
    )
}