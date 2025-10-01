import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Servizi.css";
import servicesData from "./servicesData";
import type { Service } from "./servicesData";
import type { AccessMode } from "../types";
import { useUser } from "../context/UserContext";

interface ServiziProps {
  accessMode: AccessMode;
  isMobile: boolean;
}

const Servizi: React.FC<ServiziProps> = ({ accessMode: _accessMode, isMobile: _isMobile }) => {
  const navigate = useNavigate();
  const { incrementServiceAccess } = useUser();

  return (
    <div className="servizi-container" role="main">
      <h1 className="servizi-title">Servizi</h1>
      <section className="servizi-grid" aria-label="Elenco servizi disponibili">
        {servicesData.map((service: Service) => (
          <article key={service.id} className="servizi-card" aria-labelledby={`svc-${service.id}-title`}>
            <img src={service.icon ?? ""} alt="" className="servizi-icon" aria-hidden />
            <h3 id={`svc-${service.id}-title`}>{service.name}</h3>
            <p>{service.description}</p>
            <button
              className="servizi-enter"
              onClick={() => {
                incrementServiceAccess(service.id);
                navigate(`/service/${service.id}`);
              }}
              aria-label={`Apri ${service.name}`}
              type="button"
            >
              Apri servizio
            </button>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Servizi;


