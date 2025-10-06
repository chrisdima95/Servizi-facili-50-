// Header condizionale: mostra pulsante glossario solo nella pagina servizi
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Componente per il header condizionale
const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <header className="app-header" role="banner">
      {location.pathname === "/servizi" && (
        <div className="header-actions">
          <button
            className="open-glossary-btn header-glossary-btn"
            type="button"
            onClick={() => navigate("/glossario")}
          >
            Glossario informatico
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
