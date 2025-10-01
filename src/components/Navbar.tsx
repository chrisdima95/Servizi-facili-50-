import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <nav className="navbar" aria-label="Navigazione principale">
      <button className="nav-button" aria-label="Home" onClick={() => navigate("/")}>🏠 Home</button>
      <button className="nav-button" aria-label="Servizi" onClick={() => navigate("/servizi")}>🛠️ Servizi</button>
      <button className="nav-button" aria-label="Profilo" onClick={() => navigate("/profilo")}>👤 Profilo</button>
    </nav>
  );
};

export default Navbar;
