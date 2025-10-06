// Pagina profilo utente: gestisce login, dashboard con statistiche accessi e cronologia ricerche
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import "../styles/Profilo.css";

const Profilo: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, login, accessStats, logout, searchHistory } = useUser();


  // Login state
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);


  const totalAccesses = useMemo(
    () => Object.values(accessStats).reduce((acc, v) => acc + v, 0),
    [accessStats]
  );

  // Mapping dei servizi con nomi completi e colori ufficiali dei brand
  const serviceMapping = {
    inps: { name: "INPS", color: "#0073E6" }, // Azzurro INPS
    sanita: { name: "Sanità", color: "#00A651" }, // Verde PugliaSalute
    fisco: { name: "Fisco", color: "#FF6600" }, // Arancione Agenzia delle Entrate
    poste: { name: "Poste", color: "#FFCC00" }, // Giallo Poste Italiane
    bcc: { name: "BCC", color: "#1B365D" }, // Blu scuro BCC
    inail: { name: "INAIL", color: "#0033A0" } // Blu INAIL
  };

  const pieSlices = useMemo(() => {
    const entries = Object.entries(accessStats);
    let cumulative = 0;
    return entries.map(([serviceId, count]) => {
      const percentage = totalAccesses > 0 ? (count / totalAccesses) * 100 : 0;
      const serviceInfo = serviceMapping[serviceId as keyof typeof serviceMapping] || { name: serviceId, color: "#cccccc" };
      const slice = { 
        id: serviceId, 
        name: serviceInfo.name,
        color: serviceInfo.color,
        count,
        from: cumulative, 
        to: cumulative + percentage, 
        percent: percentage 
      };
      cumulative += percentage;
      return slice;
    });
  }, [accessStats, totalAccesses]);

  const onSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const ok = await login(identifier.trim(), password.trim());
    if (!ok) {
      setError("Credenziali non valide");
      return;
    }
    navigate("/");
  };


  const radius = 60;
  const center = 75;

  const getCoords = (angleDeg: number) => {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: center + radius * Math.cos(angleRad),
      y: center + radius * Math.sin(angleRad),
    };
  };

  const arcs = pieSlices.map((s) => {
    const start = getCoords((s.from / 100) * 360);
    const end = getCoords((s.to / 100) * 360);
    const largeArc = s.to - s.from > 50 ? 1 : 0;
    
    // Per fette che rappresentano il 100%, usiamo un cerchio completo
    if (s.percent >= 99.9) {
      const pathData = `M ${center} ${center} m -${radius} 0 a ${radius} ${radius} 0 1 1 ${radius * 2} 0 a ${radius} ${radius} 0 1 1 -${radius * 2} 0 Z`;
      return (
        <path key={s.id} d={pathData} fill={s.color}>
          <title>{`${s.name}: ${s.count} accessi (${s.percent.toFixed(1)}%)`}</title>
        </path>
      );
    }
    
    const pathData = `M ${center} ${center} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
    
    return (
      <path key={s.id} d={pathData} fill={s.color}>
        <title>{`${s.name}: ${s.count} accessi (${s.percent.toFixed(1)}%)`}</title>
      </path>
    );
  });

  return (
    <div className="profile-page">
      <h2 className="profile-title">{isAuthenticated ? `Ciao, ${user?.username}` : "Profilo"}</h2>

      {!isAuthenticated && (
        <form onSubmit={onSubmitLogin} aria-label="Login" className="profile-form">
          <label className="profile-field">
            <span className="profile-label">Nome utente</span>
            <input
              type="text"
              className="profile-input"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </label>
          <label className="profile-field">
            <span className="profile-label">Password</span>
            <input
              type="password"
              className="profile-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <div role="alert" className="profile-error">{error}</div>}

          <button type="submit" className="profile-primary-btn">Accedi</button>
        </form>
      )}



      {isAuthenticated && (
        <div className="profile-dashboard">
          <h3 className="profile-subtitle">I tuoi portali</h3>
          <div className="profile-stats">
            <svg viewBox="0 0 150 150" width="220" height="220" role="img" aria-label="Grafico a torta accessi">
              {totalAccesses === 0 && <circle cx={center} cy={center} r={radius} fill="#eee" />}
              {arcs}
              {/* Etichette dei servizi all'interno del grafico */}
              {pieSlices.map((s) => {
                if (s.percent < 5) return null; // Non mostrare etichette per percentuali troppo piccole
                
                const midAngle = (s.from + s.to) / 2;
                const labelRadius = radius * 0.7; // Posiziona l'etichetta al 70% del raggio
                const finalCoords = {
                  x: center + labelRadius * Math.cos(((midAngle / 100) * 360 - 90) * Math.PI / 180),
                  y: center + labelRadius * Math.sin(((midAngle / 100) * 360 - 90) * Math.PI / 180)
                };
                
                return (
                  <text
                    key={`label-${s.id}`}
                    x={finalCoords.x}
                    y={finalCoords.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="8"
                    fill="#ffffff"
                    fontWeight="bold"
                    style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
                  >
                    {s.name}
                  </text>
                );
              })}
            </svg>
            <div className="profile-legend">
              <div className="profile-total">Totale accessi: {totalAccesses}</div>
              {pieSlices.map((s) => (
                <div className="profile-legend-item" key={s.id}>
                  <span className="profile-legend-color" style={{ backgroundColor: s.color }}></span>
                  {s.name}: {s.count} accessi ({s.percent.toFixed(1)}%)
                </div>
              ))}
              {totalAccesses === 0 && <div className="profile-legend-item">Nessun accesso registrato</div>}
            </div>
          </div>
          
          {/* Sezione cronologia termini ricercati */}
          <div className="profile-search-history">
            <h3 className="profile-subtitle">Termini ricercati di recente</h3>
            {searchHistory.length > 0 ? (
              <div className="profile-search-terms">
                {searchHistory.slice().reverse().map((term, index) => (
                  <div key={index} className="profile-search-term">
                    <span className="profile-search-number">{searchHistory.length - index}</span>
                    <span className="profile-search-text">{term}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="profile-no-searches">
                <p>Nessun termine ricercato di recente</p>
                <p className="profile-no-searches-hint">I termini che cerchi nel glossario appariranno qui</p>
              </div>
            )}
          </div>
          
          <div className="profile-logout">
            <button className="profile-secondary-btn" onClick={() => logout()}>Logout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profilo;
