import { useState, useCallback } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import StatsRow from "./components/StatsRow";
import ResultsTable from "./components/ResultsTable";
import Footer from "./components/Footer";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/places` : "/api/places";

export default function App() {
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [lastQuery, setLastQuery] = useState({ q: "", location: "" });
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async (q, location) => {
    setLoading(true);
    setError("");
    setResults([]);
    setStats(null);
    setFilter("all");
    setLastQuery({ q, location });
    setSearched(true);

    try {
      const params = new URLSearchParams({ q, location, filter: "all" });
      const res = await fetch(`${API_BASE}/search?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al buscar negocios.");
      setResults(data.results);
      setStats(data.stats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFilterChange = useCallback(
    async (newFilter) => {
      if (!lastQuery.q) return;
      setFilter(newFilter);
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          q: lastQuery.q,
          location: lastQuery.location,
          filter: newFilter,
        });
        const res = await fetch(`${API_BASE}/search?${params}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error al filtrar.");
        setResults(data.results);
        if (data.stats) setStats(data.stats);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [lastQuery]
  );

  const handleExport = useCallback(() => {
    if (!lastQuery.q) return;
    const params = new URLSearchParams({
      q: lastQuery.q,
      location: lastQuery.location,
      filter,
    });
    window.location.href = `${API_BASE}/export?${params}`;
  }, [lastQuery, filter]);

  const filteredResults =
    filter === "noweb"
      ? results.filter((r) => !r.tiene_web)
      : filter === "hasweb"
      ? results.filter((r) => r.tiene_web)
      : results;

  return (
    <div className="app-shell">
      <Header />
      <main className="main">
        <div className="hero">
          <div className="hero-badge">
            <span className="badge-dot" />
            Scraper de Google Maps
          </div>
          <h1 className="hero-title">
            Encuentra negocios<br />
            <span className="gradient-text">sin página web</span>
          </h1>
          <p className="hero-sub">
            Localiza clientes potenciales en cualquier nicho y zona del mundo.<br />
            Exporta sus datos en segundos.
          </p>
        </div>

        <SearchBar onSearch={handleSearch} loading={loading} />

        {error && (
          <div className="error-card">
            <span className="error-icon">⚠</span>
            {error}
          </div>
        )}

        {stats && !loading && (
          <StatsRow
            stats={stats}
            filter={filter}
            onFilterChange={handleFilterChange}
            onExport={handleExport}
            resultCount={filteredResults.length}
          />
        )}

        {(searched || results.length > 0) && (
          <ResultsTable
            results={filteredResults}
            loading={loading}
            searched={searched}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
