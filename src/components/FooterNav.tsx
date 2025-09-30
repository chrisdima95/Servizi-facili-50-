import React from 'react';

const FooterNav: React.FC = () => (
  <footer className="footer-nav" aria-label="Navigazione principale">
    <button className="footer-btn" aria-label="Home">🏠 Home</button>
    <button className="footer-btn" aria-label="Aiuto">❓ Aiuto</button>
    <button className="footer-btn" aria-label="Profilo">👤 Profilo</button>
  </footer>
);

export default FooterNav;
