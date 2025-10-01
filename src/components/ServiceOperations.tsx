// src/components/ServiceOperations.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import type { AccessMode } from "../types";
import type { Service } from "../pages/servicesData";
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
      <h2>Operazioni di {service.name}</h2>
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {service.operations.map((op, index) => (
          <li key={index} style={{ marginBottom: "8px" }}>
            <button
              className="detail-btn"
              onClick={() => navigate(`/operation/${service.id}/${index}`)}
            >
              {op.name}
            </button>
          </li>
        ))}
      </ul>
      <button className="detail-btn back" onClick={() => navigate("/servizi")}>
        Torna ai servizi
      </button>
    </div>
  );
};

export default ServiceOperations;
