import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-brand">LeadMapa</span>
        <span className="footer-sep">·</span>
        <span className="footer-text">Datos obtenidos de Google Maps vía Places API</span>
        <span className="footer-sep">·</span>
        <a href="mailto:hola@leadmapa.com" className="footer-link">Contacto</a>
      </div>
    </footer>
  );
}
