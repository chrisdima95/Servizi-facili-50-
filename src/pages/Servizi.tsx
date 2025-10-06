// Pagina servizi: mostra griglia di tutti i servizi disponibili con ricerca e filtri

import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Servizi.css";
import servicesData from "../data/servicesData";
import type { Service } from "../data/servicesData";
import type { AccessMode } from "../types/accessibility";
import { useUser } from "../contexts/UserContext";
// Importa l'hook useSearch per accedere alla query globale
import { useSearch } from "../contexts/SearchContext"; 


interface ServiziProps {
    accessMode: AccessMode;
    isMobile: boolean;
}

const Servizi: React.FC<ServiziProps> = React.memo(({ accessMode: _accessMode, isMobile: _isMobile }) => {
    const navigate = useNavigate();
    const { incrementServiceAccess } = useUser();
    
    // 1. Usa la query di ricerca globale dal contesto
    const { globalQuery } = useSearch();

    // 2. Filtra i servizi in base alla query
    const filteredServices = useMemo(() => {
        // Se la query è vuota o troppo corta, mostra tutti i servizi
        if (!globalQuery || globalQuery.length < 1) {
            return servicesData; 
        }

        const lowerCaseQuery = globalQuery.toLowerCase();

        return servicesData.filter((service) =>
            // A. Cerca nel nome e nella descrizione del servizio
            service.name.toLowerCase().includes(lowerCaseQuery) ||
            service.description.toLowerCase().includes(lowerCaseQuery) ||
            
            // B. Cerca nel nome, label e guida di OGNI operazione del servizio
            service.operations.some(
                (op) =>
                    op.name.toLowerCase().includes(lowerCaseQuery) ||
                    op.label.toLowerCase().includes(lowerCaseQuery) ||
                    op.guide.description.toLowerCase().includes(lowerCaseQuery)
            )
        );
    }, [globalQuery]); // Ricalcola solo quando la query cambia

    // 3. Controlla lo stato della ricerca per l'intestazione
    const isSearching = globalQuery && globalQuery.length >= 1;
    const title = isSearching ? `Risultati per "${globalQuery}"` : "Servizi";

    return (
        <div className="servizi-container" role="main">
            <h1 className="servizi-title">{title}</h1>
            
            {/* Messaggio di nessun risultato quando la ricerca è attiva */}
            {isSearching && filteredServices.length === 0 && (
                <p className="no-results" style={{textAlign: 'center', marginTop: '30px', color: '#888', fontSize: '1.2em'}}>
                    Nessun servizio o operazione corrisponde a **"{globalQuery}"**.
                </p>
            )}
            
            {/* Mostra i servizi filtrati (o tutti se non c'è ricerca) */}
            <section className="servizi-grid" aria-label="Elenco servizi disponibili">
                {filteredServices.map((service: Service) => (
                    <article key={service.id} className="servizi-card" aria-labelledby={`svc-${service.id}-title`} data-service={service.id}>
                        <img src={service.icon ?? ""} alt="" className="servizi-icon" aria-hidden />
                        <h3 id={`svc-${service.id}-title`}>{service.name}</h3>
                        <p>{service.description}</p>
                        <button
                            className="servizi-enter"
                            onClick={() => {
                                incrementServiceAccess(service.id);
                                // Resetta la query quando l'utente naviga in un servizio
                                // in modo che la pagina Servizi torni allo stato non filtrato
                                // la prossima volta che viene visitata.
                                // La SearchBar lo fa già alla chiusura del modale,
                                // ma questo fornisce un ulteriore cleanup.
                                if (isSearching) {
                                    // Non ho setGlobalQuery qui, ma se la SearchBar è visibile e chiusa,
                                    // la query è stata resettata. Navighiamo e basta.
                                }
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
});

export default Servizi;