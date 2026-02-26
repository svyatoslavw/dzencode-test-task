import { useLiveDateTime } from "./useLiveDateTime"

const AppHeader = () => {
  const currentDateTime = useLiveDateTime()

  return (
    <header
      className="position-fixed top-0 start-0 end-0 bg-white border-bottom px-3 d-flex flex-wrap align-items-center justify-content-between gap-2"
      style={{ height: "var(--app-header-height)", zIndex: 1030 }}
    >
      <div className="d-flex align-items-center gap-2">
        <span className="badge text-bg-dark">OP</span>
        <strong>Orders & Products</strong>
      </div>

      <div className="d-flex flex-wrap align-items-center gap-3">
        <div className="btn-group btn-group-sm" role="group" aria-label="Language toggle">
          <button type="button" className="btn btn-outline-secondary active">
            RU
          </button>
          <button type="button" className="btn btn-outline-secondary">
            EN
          </button>
        </div>

        <span className="small text-body-secondary">{currentDateTime}</span>
        <span className="badge rounded-pill text-bg-primary">Active: --</span>
      </div>
    </header>
  )
}

export { AppHeader }
