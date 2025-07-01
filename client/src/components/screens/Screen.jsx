export function Screen({ children, align = "center" }) {
    return (
        <div className="modal monitor is-active">
            <div className="modal-content">
                <div className={`box intro align-${align}`}>
                    { children }
                </div>
            </div>
        </div>
    )
}