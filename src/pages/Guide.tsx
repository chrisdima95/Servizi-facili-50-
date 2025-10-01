import React from "react";
import { useNavigate } from "react-router-dom";
import type { AccessMode } from "../types";
import "../styles/Guide.css";

interface GuideProps {
  accessMode: AccessMode;
}

const Guide: React.FC<GuideProps> = ({ accessMode }) => {
  const navigate = useNavigate();

  return (
    <div className={`guide-page ${accessMode.largeText ? "large-text-mode" : ""} ${accessMode.highContrast ? "high-contrast-mode" : ""}`}>
      <div className="guide-container">
        <h1 className="guide-title">GUIDA COMPLETA</h1>
        <p className="guide-subtitle">
          Tutto quello che devi sapere per utilizzare i servizi digitali in modo semplice e sicuro
        </p>

        <div className="guide-sections">
          {/* Sezione 1: Introduzione */}
          <section className="guide-section">
            <h2 className="section-title"> Cos'è Servizi Facili 50+</h2>
            <div className="section-content">
              <p>
                <strong>Servizi Facili 50+</strong> è una piattaforma digitale progettata specificamente per le persone over 50 
                che vogliono accedere ai servizi pubblici online in modo semplice e sicuro.
              </p>
              <div className="highlight-box">
                <h3>Perché è stato creato?</h3>
                <ul>
                  <li>Ridurre le code agli sportelli</li>
                  <li>Permettere di fare tutto da casa</li>
                  <li>Rendere i servizi digitali accessibili a tutti</li>
                  <li>Fornire guide passo-passo semplici</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Sezione 2: Come iniziare */}
          <section className="guide-section">
            <h2 className="section-title"> Come Iniziare</h2>
            <div className="section-content">
              <div className="steps-container">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h3>Registrati</h3>
                    <p>Clicca su "Profilo" nella barra di navigazione e crea il tuo account con email e password.</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h3>Accedi</h3>
                    <p>Usa le tue credenziali per accedere alla piattaforma.</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h3>Esplora i Servizi</h3>
                    <p>Clicca su "Servizi" per vedere tutti i servizi disponibili.</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h3>Scegli un Servizio</h3>
                    <p>Clicca sulla card del servizio che ti interessa per vedere le operazioni disponibili.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sezione 3: Servizi Disponibili */}
          <section className="guide-section">
            <h2 className="section-title"> Servizi Disponibili</h2>
            <div className="section-content">
              <div className="services-grid">
                <div className="service-card">
                  <img src="/inps.png" alt="Logo INPS" className="service-logo" />
                  <h3>Pensioni (INPS)</h3>
                  <ul>
                    <li>Domanda di pensione</li>
                    <li>Indennità di accompagnamento</li>
                    <li>Assistenza domiciliare</li>
                  </ul>
                </div>
                <div className="service-card">
                  <img src="/pugliasalute.png" alt="Logo PugliaSalute" className="service-logo" />
                  <h3>Sanità (PugliaSalute)</h3>
                  <ul>
                    <li>Prenotazione visite</li>
                    <li>Ricette elettroniche</li>
                    <li>Referti online</li>
                  </ul>
                </div>
                <div className="service-card">
                  <img src="/agenziaEntrate.png" alt="Logo Agenzia delle Entrate" className="service-logo" />
                  <h3>Agenzia delle Entrate</h3>
                  <ul>
                    <li>730 precompilato</li>
                    <li>Certificazioni</li>
                    <li>Comunicazioni</li>
                  </ul>
                </div>
                <div className="service-card">
                  <img src="/poste.png" alt="Logo Poste Italiane" className="service-logo" />
                  <h3>Poste Italiane</h3>
                  <ul>
                    <li>PostePay</li>
                    <li>Bollettini</li>
                    <li>Pacchi</li>
                  </ul>
                </div>
                <div className="service-card">
                  <img src="/bcc.png" alt="Logo BCC" className="service-logo" />
                  <h3>BCC</h3>
                  <ul>
                    <li>Conto corrente</li>
                    <li>Bonifici</li>
                    <li>Mutui</li>
                  </ul>
                </div>
                <div className="service-card">
                  <img src="/inail.png" alt="Logo INAIL" className="service-logo" />
                  <h3>INAIL</h3>
                  <ul>
                    <li>Denunce infortuni</li>
                    <li>Prestazioni</li>
                    <li>Certificazioni</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Sezione 4: Strumenti di Accessibilità */}
          <section className="guide-section">
            <h2 className="section-title">♿ Strumenti di Accessibilità</h2>
            <div className="section-content">
              <p>
                La piattaforma include strumenti speciali per rendere l'uso più facile e confortevole:
              </p>
              <div className="accessibility-features">
                <div className="feature">
                  <div className="feature-icon">🔍</div>
                  <h3>Testo Grande</h3>
                  <p>Clicca sull'icona "A+" per ingrandire il testo e renderlo più leggibile.</p>
                </div>
                <div className="feature">
                  <div className="feature-icon">🎨</div>
                  <h3>Alto Contrasto</h3>
                  <p>Attiva la modalità alto contrasto per una migliore visibilità.</p>
                </div>
                <div className="feature">
                  <div className="feature-icon">🎯</div>
                  <h3>Modalità Focus</h3>
                  <p>Evidenzia gli elementi importanti per una navigazione più facile.</p>
                </div>
                <div className="feature">
                  <div className="feature-icon">📚</div>
                  <h3>Glossario</h3>
                  <p>Consulta il glossario informatico per capire i termini tecnici.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Sezione 5: Consigli per la Sicurezza */}
          <section className="guide-section">
            <h2 className="section-title">🔒 Consigli per la Sicurezza</h2>
            <div className="section-content">
              <div className="security-tips">
                <div className="tip">
                  <h3>🛡️ Password Sicure</h3>
                  <ul>
                    <li>Usa almeno 8 caratteri</li>
                    <li>Includi numeri e simboli</li>
                    <li>Non condividere mai le tue password</li>
                    <li>Cambia password regolarmente</li>
                  </ul>
                </div>
                <div className="tip">
                  <h3>🔐 Proteggi i Tuoi Dati</h3>
                  <ul>
                    <li>Non inserire dati personali su siti sospetti</li>
                    <li>Controlla sempre l'indirizzo del sito</li>
                    <li>Non cliccare su link sospetti nelle email</li>
                    <li>Usa sempre connessioni sicure (HTTPS)</li>
                  </ul>
                </div>
                <div className="tip">
                  <h3>📱 Dispositivi Sicuri</h3>
                  <ul>
                    <li>Mantieni aggiornato il tuo dispositivo</li>
                    <li>Installa un antivirus</li>
                    <li>Non lasciare il computer incustodito</li>
                    <li>Chiudi sempre la sessione quando finisci</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Sezione 6: Risoluzione Problemi */}
          <section className="guide-section">
            <h2 className="section-title"> Risoluzione Problemi Comuni</h2>
            <div className="section-content">
              <div className="troubleshooting">
                <div className="problem">
                  <h3>Non riesco ad accedere</h3>
                  <p><strong>Soluzione:</strong> Controlla email e password. Se hai dimenticato la password, usa la funzione "Password dimenticata".</p>
                </div>
                <div className="problem">
                  <h3>Il sito è lento</h3>
                  <p><strong>Soluzione:</strong> Controlla la tua connessione internet. Prova a ricaricare la pagina.</p>
                </div>
                <div className="problem">
                  <h3>Non vedo bene il testo</h3>
                  <p><strong>Soluzione:</strong> Usa gli strumenti di accessibilità (testo grande e alto contrasto) disponibili nella piattaforma.</p>
                </div>
                <div className="problem">
                  <h3>Non capisco alcuni termini</h3>
                  <p><strong>Soluzione:</strong> Consulta il glossario informatico disponibile nella pagina Servizi.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Sezione 7: Contatti e Supporto */}
          <section className="guide-section">
            <h2 className="section-title"> Contatti e Supporto</h2>
            <div className="section-content">
              <div className="support-info">
                <div className="support-item">
                  <h3>🆘 Assistenza Tecnica</h3>
                  <p>Per problemi tecnici con la piattaforma:</p>
                  <p><strong>Email:</strong> supporto@servizifacili50.it</p>
                  <p><strong>Telefono:</strong> 800-123-456 (gratuito)</p>
                </div>
                <div className="support-item">
                  <h3>🏛️ Assistenza Servizi Pubblici</h3>
                  <p>Per domande sui servizi specifici, contatta direttamente:</p>
                  <ul>
                    <li><strong>INPS:</strong> 803-164 (gratuito)</li>
                    <li><strong>Agenzia Entrate:</strong> 800-123-456</li>
                    <li><strong>Poste Italiane:</strong> 803-160</li>
                  </ul>
                </div>
                <div className="support-item">
                  <h3>👥 Aiuto da Familiari</h3>
                  <p>Non esitare a chiedere aiuto a:</p>
                  <ul>
                    <li>Figli o nipoti</li>
                    <li>Amici più esperti</li>
                    <li>Centri anziani</li>
                    <li>Biblioteche pubbliche</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="guide-footer">
          <button 
            className="back-button"
            onClick={() => navigate("/")}
            aria-label="Torna alla home"
          >
            ← Torna alla Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Guide;
