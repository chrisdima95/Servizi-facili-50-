import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import SearchBar from "./SearchBar";
import "../styles/Navbar.css";

interface NavbarProps {
  isMobile?: boolean;
}

const Navbar: React.FC<NavbarProps> = React.memo(({ isMobile = false }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useUser();
  const label = isAuthenticated ? `👤 ${user?.username}` : "👤 Profilo";

  // Ottimizzazione: memoizza le funzioni di navigazione
  const navigateHome = useCallback(() => navigate("/"), [navigate]);
  const navigateServizi = useCallback(() => navigate("/servizi"), [navigate]);
  const navigateGuide = useCallback(() => navigate("/guide"), [navigate]);
  const navigateProfilo = useCallback(() => navigate("/profilo"), [navigate]);

  return (
    <nav className="navbar" aria-label="Navigazione principale">
      <div className="navbar-spacer"></div>
      <div className="navbar-buttons">
        <button className="footer-btn" aria-label="Home" onClick={navigateHome}> Home</button>
        <button className="footer-btn" aria-label="Servizi" onClick={navigateServizi}> Servizi</button>
        <button className="footer-btn" aria-label="Guide" onClick={navigateGuide}> Guide</button>
        <button className="footer-btn" aria-label="Profilo" onClick={navigateProfilo}>{label}</button>
      </div>
      <div className="navbar-search">
        <SearchBar isMobile={isMobile} />
      </div>
    </nav>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
