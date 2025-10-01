import React from "react";
import { useNavigate } from "react-router-dom";
import ButtonService from "../components/ButtonService";
import servicesData from "./servicesData";
import type { Service } from "./servicesData";
import type { AccessMode } from "../types";
import { useUser } from "../context/UserContext";

interface ServiziProps {
  accessMode: AccessMode;
  isMobile: boolean;
}

const Servizi: React.FC<ServiziProps> = ({ accessMode, isMobile }) => {
  const navigate = useNavigate();
  const { incrementServiceAccess } = useUser();

  return (
    <div className={`home-container ${isMobile ? "mobile" : "desktop"}`}>
      <div className="services-grid">
        {servicesData.map((service: Service) => (
          <ButtonService
            key={service.id}
            icon={service.icon ?? ""}
            label={service.name}
            extraClassName={service.id}
            onClick={() => {
              incrementServiceAccess(service.id);
              navigate(`/service/${service.id}`);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Servizi;


