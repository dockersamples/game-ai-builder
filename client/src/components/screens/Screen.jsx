export function Screen({ children }) {
    return (
        <div className="modal monitor is-active">
            <div className="modal-content">
                <div className="box intro is-vcentered">
                    { children }
                </div>
            </div>
        </div>
    )
}