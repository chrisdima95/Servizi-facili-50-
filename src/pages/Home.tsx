// src/pages/Home.tsx
import React, { useState } from "react";
import type { AccessMode } from "../types";
import "../App.css";

interface HomeProps {
  accessMode: AccessMode;
  isMobile: boolean;
}

const Home: React.FC<HomeProps> = ({ accessMode, isMobile }) => {
  const [glossaryVisible] = useState(false);
  return (
    <div className={`home-container ${isMobile ? "mobile" : "desktop"}`}>
      {/* Contenuto spostato nella pagina Servizi */}
    </div>
  );
};

export default Home;
