import "./ResultsTable.css";

export default function ResultsTable({ results, loading, searched }) {
  if (loading) {
    return (
      <div className="table-wrap">
        <div className="skeleton-header" />
        {[...Array(8)].map((_, i) => (
          <div key={i} className="skeleton-row" style={{ opacity: 1 - i * 0.1 }} />
        ))}
      </div>
    );
  }

  if (searched && results.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📭</div>
        <p className="empty-title">Sin resultados</p>
        <p className="empty-sub">Prueba con otro nicho, zona o cambia el filtro.</p>
      </div>
    );
  }

  if (!searched) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🗺️</div>
        <p className="empty-title">Introduce un nicho y una zona</p>
        <p className="empty-sub">Busca fontaneros en Madrid, dentistas en Sevilla, restaurantes en México DF...</p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="results-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Valoración</th>
            <th>Web</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {results.map((biz, i) => (
            <BusinessRow key={biz.id || i} biz={biz} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BusinessRow({ biz }) {
  return (
    <tr>
      <td className="td-name">
        <span className="biz-name">{biz.nombre}</span>
      </td>
      <td className="td-phone">
        {biz.telefono ? (
          <a href={`tel:${biz.telefono.replace(/\s/g, "")}`} className="phone-link">
            {biz.telefono}
          </a>
        ) : (
          <span className="muted">—</span>
        )}
      </td>
      <td className="td-address">
        <span title={biz.direccion}>{biz.direccion}</span>
      </td>
      <td className="td-rating">
        {biz.valoracion ? (
          <span className="rating">
            ⭐ {biz.valoracion}
            <span className="rating-count">({biz.resenas})</span>
          </span>
        ) : (
          <span className="muted">—</span>
        )}
      </td>
      <td className="td-web">
        {biz.tiene_web ? (
          <span className="badge badge-green">Sí</span>
        ) : (
          <span className="badge badge-red">No tiene</span>
        )}
      </td>
      <td className="td-cat">
        <span className="category-tag">{biz.categoria || "—"}</span>
      </td>
      <td className="td-actions">
        <div className="actions">
          {biz.google_maps_url && (
            <a
              href={biz.google_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="action-btn"
              title="Ver en Google Maps"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Maps
            </a>
          )}
          {biz.tiene_web && biz.web_url && (
            <a
              href={biz.web_url}
              target="_blank"
              rel="noopener noreferrer"
              className="action-btn"
              title="Ver su web"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              Web
            </a>
          )}
        </div>
      </td>
    </tr>
  );
}
