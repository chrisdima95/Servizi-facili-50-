// src/components/OperationGuide.tsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import servicesData from "../data/servicesData";
import type { Service, Operation } from "../data/servicesData";
import type { AccessMode } from "../types";
import "../styles/ServiceDetail.css";

interface OperationGuideProps {
  accessMode: AccessMode;
}

const OperationGuide: React.FC<OperationGuideProps> = ({ accessMode }) => {
  const { serviceId, operationId } = useParams<{ serviceId: string; operationId: string }>();
  const navigate = useNavigate();

  const service: Service | undefined = servicesData.find((s) => s.id === serviceId);
  const operation: Operation | undefined = service?.operations[Number(operationId)];

  if (!service || !operation) {
    return (
      <div
        className={`service-operations ${
          accessMode.highContrast ? "high-contrast-mode" : ""
        } ${accessMode.largeText ? "large-text-mode" : ""}`}
      >
        <p>Operazione non trovata.</p>
        <button className="detail-btn back" onClick={() => navigate(`/service/${serviceId}`)}>
          ← Torna indietro
        </button>
      </div>
    );
  }

  return (
    <div
      className={`service-operations ${
        accessMode.highContrast ? "high-contrast-mode" : ""
      } ${accessMode.largeText ? "large-text-mode" : ""}`}
      aria-live="polite"
    >
      <h2>{operation.name}</h2>

      <section aria-label={`Guida per ${operation.name}`}>
        <h3>Come fare</h3>
        <p style={{ textAlign: "left", whiteSpace: "pre-wrap" }}>
          {operation.guide.description}
        </p>
      </section>

      <section aria-label="Consigli utili">
        <h3>Consigli utili</h3>
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {operation.guide.tips.map((tip: string, idx: number) => (
            <li key={idx} style={{ marginBottom: "4px" }}>{tip}</li>
          ))}
        </ul>
      </section>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 16 }}>
        <a
          className="detail-btn"
          href={operation.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Apri il sito ufficiale per ${operation.name}`}
          style={{ textDecoration: "none" }}
        >
          Vai al sito ufficiale
        </a>

        <button className="detail-btn back" onClick={() => navigate(`/service/${service.id}`)}>
          Torna indietro
        </button>
      </div>
    </div>
  );
};

export default OperationGuide;
