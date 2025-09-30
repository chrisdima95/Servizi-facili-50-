import React from "react";
import "../styles/ServiceOperations.css";
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

interface ServiceOperationsProps {
  service: Service;
  onBack: () => void;
  accessMode: AccessMode;
}

const ServiceOperations: React.FC<ServiceOperationsProps> = ({
  service,
  onBack,
  accessMode,
}) => {
  return (
    <div
      className={`service-operations ${
        accessMode.highContrast ? "high-contrast-mode" : ""
      } ${accessMode.largeText ? "large-text-mode" : ""}`}
    >
      <h2>{service.name}</h2>
      <div className="operations-list">
        {service.operations.map((op) => (
          <a
            key={op.label}
            href={op.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`operation-btn ${
              accessMode.highContrast ? "high-contrast-mode" : ""
            } ${accessMode.largeText ? "large-text-mode" : ""}`}
          >
            {op.label}
          </a>
        ))}
      </div>
      <button onClick={onBack} className="detail-btn back">
        Torna ai servizi
      </button>
    </div>
  );
};

export default ServiceOperations;
