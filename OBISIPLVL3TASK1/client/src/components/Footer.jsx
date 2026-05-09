/**
 * Footer Component
 */
const Footer = () => {
  return (
    <footer className="footer" id="main-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <span className="footer-logo">🍕 Pizza<span className="brand-accent">Hub</span></span>
          <p className="footer-tagline">Crafted with love, delivered with speed</p>
        </div>
        <div className="footer-links">
          <span>© {new Date().getFullYear()} PizzaHub</span>
          <span className="footer-divider">•</span>
          <span>Built for Oasis Infobyte</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
