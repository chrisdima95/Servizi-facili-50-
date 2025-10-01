import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

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
    <div className="profile-page" style={{ maxWidth: 420, margin: "24px auto" }}>
      <h2 style={{ marginBottom: 16 }}>{isAuthenticated ? `Ciao, ${user?.username}` : "Profilo"}</h2>

      {!isAuthenticated && mode === "login" && (
        <form onSubmit={onSubmitLogin} aria-label="Login" style={{ display: "grid", gap: 12 }}>
          <label>
            <div>Indirizzo e-mail o nome utente</div>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </label>
          <label>
            <div>Password</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <div role="alert" style={{ color: "#c00" }}>{error}</div>}

          <button type="submit" className="detail-btn">Accedi</button>
          <div>
            <button
              type="button"
              className="linklike"
              onClick={() => setMode("register")}
              aria-label="Nuovo utente"
            >
              Nuovo utente
            </button>
          </div>
        </form>
      )}

      {!isAuthenticated && mode === "register" && (
        <form onSubmit={onSubmitRegister} aria-label="Registrazione" style={{ display: "grid", gap: 12 }}>
          <label>
            <div>Nome</div>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </label>
          <label>
            <div>Cognome</div>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </label>
          <label>
            <div>Indirizzo e-mail</div>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            <div>Nome utente</div>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>
          <label>
            <div>Password</div>
            <input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required />
          </label>

          {error && <div role="alert" style={{ color: "#c00" }}>{error}</div>}

          <div style={{ display: "flex", gap: 8 }}>
            <button type="submit" className="detail-btn">Crea account</button>
            <button type="button" className="detail-btn back" onClick={() => setMode("login")}>Torna al login</button>
          </div>
        </form>
      )}

      {isAuthenticated && (
        <div style={{ marginTop: 24 }}>
          <h3>I tuoi portali</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <svg viewBox="0 0 150 150" width="200" height="200" role="img" aria-label="Grafico a torta accessi">
              <circle cx={center} cy={center} r={radius} fill="#eee" />
              {arcs}
            </svg>
            <div>
              <div>Totale accessi: {totalAccesses}</div>
              {pieSlices.map((s) => (
                <div key={s.id}>{s.id}: {s.percent.toFixed(1)}%</div>
              ))}
              {totalAccesses === 0 && <div>Nessun accesso registrato</div>}
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <button className="detail-btn back" onClick={() => logout()}>Logout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profilo;

