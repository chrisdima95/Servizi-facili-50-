import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "../styles/Profilo.css";

const Profilo: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, login, register, accessStats, logout } = useUser();

  const [mode, setMode] = useState<"login" | "register">("login");

  // Login state
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Register state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const totalAccesses = useMemo(
    () => Object.values(accessStats).reduce((acc, v) => acc + v, 0),
    [accessStats]
  );

  const pieSlices = useMemo(() => {
    const entries = Object.entries(accessStats);
    let cumulative = 0;
    return entries.map(([serviceId, count]) => {
      const percentage = totalAccesses > 0 ? (count / totalAccesses) * 100 : 0;
      const slice = { id: serviceId, from: cumulative, to: cumulative + percentage, percent: percentage };
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

  const onSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const ok = await register({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      username: username.trim(),
      password: regPassword.trim(),
    });
    if (!ok) {
      setError("Compila tutti i campi correttamente");
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

  const arcs = pieSlices.map((s, i) => {
    const start = getCoords((s.from / 100) * 360);
    const end = getCoords((s.to / 100) * 360);
    const largeArc = s.to - s.from > 50 ? 1 : 0;
    const pathData = `M ${center} ${center} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
    const colors = ["#4e79a7", "#f28e2c", "#e15759", "#76b7b2", "#59a14f", "#edc949", "#af7aa1", "#ff9da7", "#9c755f", "#bab0ab"];
    return (
      <path key={s.id} d={pathData} fill={colors[i % colors.length]}>
        <title>{`${s.id}: ${s.percent.toFixed(1)}%`}</title>
      </path>
    );
  });

  return (
    <div className="profile-page">
      <h2 className="profile-title">{isAuthenticated ? `Ciao, ${user?.username}` : "Profilo"}</h2>

      {!isAuthenticated && mode === "login" && (
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

      {!isAuthenticated && mode === "register" && (
        <form onSubmit={onSubmitRegister} aria-label="Registrazione" className="profile-form">
          <label className="profile-field">
            <span className="profile-label">Nome</span>
            <input className="profile-input" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </label>
          <label className="profile-field">
            <span className="profile-label">Cognome</span>
            <input className="profile-input" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </label>
          <label className="profile-field">
            <span className="profile-label">Indirizzo e-mail</span>
            <input className="profile-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="profile-field">
            <span className="profile-label">Nome utente</span>
            <input className="profile-input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>
          <label className="profile-field">
            <span className="profile-label">Password</span>
            <input className="profile-input" type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required />
          </label>

          {error && <div role="alert" className="profile-error">{error}</div>}

          <div className="profile-actions">
            <button type="submit" className="profile-primary-btn">Crea account</button>
            <button type="button" className="profile-secondary-btn" onClick={() => setMode("login")}>Torna al login</button>
          </div>
        </form>
      )}


      {isAuthenticated && (
        <div className="profile-dashboard">
          <h3 className="profile-subtitle">I tuoi portali</h3>
          <div className="profile-stats">
            <svg viewBox="0 0 150 150" width="220" height="220" role="img" aria-label="Grafico a torta accessi">
              <circle cx={center} cy={center} r={radius} fill="#eee" />
              {arcs}
            </svg>
            <div className="profile-legend">
              <div className="profile-total">Totale accessi: {totalAccesses}</div>
              {pieSlices.map((s) => (
                <div className="profile-legend-item" key={s.id}>{s.id}: {s.percent.toFixed(1)}%</div>
              ))}
              {totalAccesses === 0 && <div className="profile-legend-item">Nessun accesso registrato</div>}
            </div>
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
