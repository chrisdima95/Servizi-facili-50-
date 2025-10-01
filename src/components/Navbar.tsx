import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useUser();
  const label = isAuthenticated ? `👤 ${user?.username}` : "👤 Profilo";

  return (
    <nav className="navbar" aria-label="Navigazione principale">
      <button className="footer-btn" aria-label="Home" onClick={() => navigate("/")}> Home</button>
      <button className="footer-btn" aria-label="Servizi" onClick={() => navigate("/servizi")}> Servizi</button>
      <button className="footer-btn" aria-label="Profilo" onClick={() => navigate("/profilo")}>{label}</button>
    </nav>
  );
};

export default Navbar;
