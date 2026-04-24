import { useState } from "react";
import "./SearchBar.css";

const NICHE_SUGGESTIONS = [
  "Fontaneros", "Electricistas", "Dentistas", "Abogados", "Restaurantes",
  "Peluquerías", "Talleres mecánicos", "Gimnasios", "Ferreterías", "Ópticas",
];

export default function SearchBar({ onSearch, loading }) {
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!q.trim() || !location.trim()) return;
    onSearch(q.trim(), location.trim());
  };

  const useSuggestion = (s) => {
    setQ(s);
    document.getElementById("location-input")?.focus();
  };

  return (
    <div className="searchbar-wrap">
      <form className="searchbar" onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="input-label">Tipo de negocio</label>
          <div className="input-icon-wrap">
            <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="ej: fontaneros, dentistas..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              required
              autoFocus
            />
          </div>
        </div>

        <div className="input-divider" />

        <div className="input-group">
          <label className="input-label">Ciudad o zona</label>
          <div className="input-icon-wrap">
            <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <input
              id="location-input"
              type="text"
              className="search-input"
              placeholder="ej: Madrid, Barcelona..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="search-btn" disabled={loading || !q.trim() || !location.trim()}>
          {loading ? (
            <span className="btn-loading">
              <span className="spinner" />
              Buscando...
            </span>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              Buscar
            </>
          )}
        </button>
      </form>

      <div className="suggestions">
        <span className="suggestions-label">Popular:</span>
        {NICHE_SUGGESTIONS.map((s) => (
          <button key={s} className="suggestion-chip" onClick={() => useSuggestion(s)} type="button">
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
