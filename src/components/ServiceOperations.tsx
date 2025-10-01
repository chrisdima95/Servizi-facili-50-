// src/components/ServiceOperations.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { AccessMode } from "../types";
import type { Service } from "../pages/servicesData";
import "../styles/ServiceDetail.css";
import { useUser } from "../context/UserContext";

interface ServiceOperationsProps {
  service: Service;
  accessMode: AccessMode;
}

const ServiceOperations: React.FC<ServiceOperationsProps> = ({ service, accessMode }) => {
  const navigate = useNavigate();
  const { incrementServiceAccess } = useUser();

  useEffect(() => {
    incrementServiceAccess(service.id);
    // only once per mount for this service view
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service.id]);

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
      <button className="detail-btn back" onClick={() => navigate("/")}>
        Torna ai servizi
      </button>
    </div>
  );
};

export default ServiceOperations;
