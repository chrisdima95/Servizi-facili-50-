// src/pages/Home.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonService from "../components/ButtonService";
import servicesData from "./servicesData";
import type { Service } from "./servicesData";
import type { AccessMode } from "../types";
import "../App.css";

interface HomeProps {
  accessMode: AccessMode;
  isMobile: boolean;
}

const Home: React.FC<HomeProps> = ({ accessMode, isMobile }) => {
  const navigate = useNavigate();
  const [glossaryVisible, setGlossaryVisible] = useState(true);

  const handleGlossaryClick = () => {
    setGlossaryVisible(false);
    navigate("/glossario");
  };

  return (
    <div className={`home-container ${isMobile ? "mobile" : "desktop"}`}>
      {/* Griglia dei servizi */}
      <div className="services-grid">
        {servicesData.map((service: Service) => (
          <ButtonService
            key={service.id}
            icon={service.icon ?? ""}
            label={service.name}
            extraClassName={service.id}
            onClick={() => navigate(`/service/${service.id}`)}
          />
        ))}
      </div>

      {/* Bottone Glossario fuori dalla griglia */}
      {glossaryVisible && (
        <div className="glossary-container-button">
          <button
            className={`open-glossary-btn ${
              accessMode.largeText ? "large-text-mode" : ""
            } ${accessMode.highContrast ? "high-contrast-mode" : ""}`}
            onClick={handleGlossaryClick}
          >
            Glossario informatico
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
