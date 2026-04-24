import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="13" cy="13" r="13" fill="url(#lg)" />
            <path d="M13 7c-3.3 0-6 2.7-6 6 0 4.5 6 10 6 10s6-5.5 6-10c0-3.3-2.7-6-6-6zm0 8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" fill="white" />
            <defs>
              <linearGradient id="lg" x1="0" y1="0" x2="26" y2="26" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6c63ff" />
                <stop offset="1" stopColor="#c084fc" />
              </linearGradient>
            </defs>
          </svg>
          <span className="logo-text">LeadMapa</span>
        </div>
        <nav className="nav">
          <a href="#como-funciona" className="nav-link">Cómo funciona</a>
          <a href="#precios" className="nav-link">Precios</a>
        </nav>
      </div>
    </header>
  );
}
