import "./StatsRow.css";

export default function StatsRow({ stats, filter, onFilterChange, onExport, resultCount }) {
  const { total, noWeb, hasWeb, avgRating } = stats;

  return (
    <div className="stats-section">
      <div className="stats-grid">
        <StatCard label="Encontrados" value={total} icon="📍" />
        <StatCard label="Sin web" value={noWeb} icon="🚫" highlight />
        <StatCard label="Con web" value={hasWeb} icon="🌐" />
        <StatCard
          label="Valoración media"
          value={avgRating ? `${avgRating} ★` : "—"}
          icon="⭐"
        />
      </div>

      <div className="controls-row">
        <div className="filter-pills">
          {[
            { id: "all", label: "Todos", count: total },
            { id: "noweb", label: "Sin web", count: noWeb },
            { id: "hasweb", label: "Con web", count: hasWeb },
          ].map(({ id, label, count }) => (
            <button
              key={id}
              className={`filter-pill${filter === id ? " active" : ""}`}
              onClick={() => onFilterChange(id)}
            >
              {label}
              <span className="pill-count">{count}</span>
            </button>
          ))}
        </div>

        <div className="results-actions">
          <span className="results-count">{resultCount} resultado{resultCount !== 1 ? "s" : ""}</span>
          <button className="export-btn" onClick={onExport}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Exportar CSV
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, highlight }) {
  return (
    <div className={`stat-card${highlight ? " highlight" : ""}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
