// Pagina operazioni servizio: mostra lista delle operazioni disponibili per un servizio specifico
import React from "react";
import { useNavigate } from "react-router-dom";
import type { AccessMode } from "../types/accessibility";
import type { Service } from "../data/servicesData";
import "../styles/ServiceDetail.css";

interface ServiceOperationsProps {
  service: Service;
  accessMode: AccessMode;
}

const ServiceOperations: React.FC<ServiceOperationsProps> = ({ service, accessMode }) => {
  const navigate = useNavigate();
  

  return (
    <div
      className={`service-operations ${
        accessMode.highContrast ? "high-contrast-mode" : ""
      } ${accessMode.largeText ? "large-text-mode" : ""}`}
    >
      <h2>Operazioni {service.id === 'inps' ? '(INPS)' : service.id === 'inail' ? 'INAIL' : service.id === 'poste' ? 'Poste Italiane' : service.id === 'fisco' ? 'Agenzia delle Entrate' : service.id === 'sanita' ? 'Sanità (Puglia Salute)' : service.id === 'bcc' ? 'BCC Bari e Taranto' : `di ${service.name}`}</h2>
      <div className={`operations-grid ${service.operations.length === 2 ? 'two-cards' : ''}`}>
        {service.operations.map((op, index) => (
          <div key={index} className="operation-card">
            <h3>{op.name}</h3>
            <button
              className="operation-button"
              onClick={() => navigate(`/operation/${service.id}/${index}`)}
            >
              Vedi operazione
            </button>
          </div>
        ))}
      </div>
      <button className="detail-btn back" onClick={() => navigate("/servizi")}>
        Torna ai servizi
      </button>
    </div>
  );
};

export default ServiceOperations;
