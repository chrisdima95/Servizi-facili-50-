import React from "react";
import "../styles/ServiceDetail.css";
import type { AccessMode } from "../pages/Home";

interface Operation {
  label: string;
  url: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  operations: Operation[];
}

interface ServiceDetailProps {
  service: Service;
  accessMode: AccessMode; // Passiamo accessMode per gestire High Contrast / Large Text
  onShowOperations: () => void;
  onBack: () => void;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({
  service,
  accessMode,
  onShowOperations,
  onBack,
}) => {
  return (
    <div
      className={`service-operations 
        ${accessMode.largeText ? "large-text-mode" : ""} 
        ${accessMode.highContrast ? "high-contrast-mode" : ""}`}
    >
      <h2>{service.name}</h2>
      <p>{service.description}</p>
      <button onClick={onShowOperations} className="detail-btn">
        Vedi operazioni
      </button>
      <button onClick={onBack} className="detail-btn back">
        Torna ai servizi
      </button>
    </div>
  );
};

export default ServiceDetail;
