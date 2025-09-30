import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className="navbar" aria-label="Navigazione principale">
      <button className="nav-button" aria-label="Home">🏠 Home</button>
      <button className="nav-button" aria-label="Aiuto">❓ Aiuto</button>
      <button className="nav-button" aria-label="Profilo">👤 Profilo</button>
    </nav>
  );
};

export default Navbar;
