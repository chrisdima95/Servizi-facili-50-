// src/pages/Home.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AccessMode } from "../types/accessibility";
import "../styles/Home.css";
import { FaLaptop, FaBookOpen, FaSearch } from "react-icons/fa";

interface HomeProps {
  accessMode: AccessMode;
  isMobile: boolean;
}

const Home: React.FC<HomeProps> = React.memo(({ accessMode, isMobile }) => {
  const navigate = useNavigate();
  
  // State per il form di contatto
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    telefono: '',
    email: '',
    oggetto: '',
    messaggio: '',
    privacy: false
  });
  
  const [errors, setErrors] = useState({
    email: '',
    messaggio: ''
  });

  // Validazione email
  const validateEmail = (email: string) => {
    if (!email) {
      return 'L\'email è obbligatoria';
    }
    if (!email.includes('@')) {
      return 'Inserisci un\'email valida (deve contenere @)';
    }
    return '';
  };

  // Gestione cambiamenti nei campi del form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Validazione in tempo reale per email
    if (name === 'email') {
      setErrors(prev => ({
        ...prev,
        email: validateEmail(value)
      }));
    }
    
    // Validazione in tempo reale per messaggio
    if (name === 'messaggio') {
      setErrors(prev => ({
        ...prev,
        messaggio: value.trim() === '' ? 'Il messaggio è obbligatorio' : ''
      }));
    }
  };

  // Gestione invio form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validazione finale
    const emailError = validateEmail(formData.email);
    const messaggioError = formData.messaggio.trim() === '' ? 'Il messaggio è obbligatorio' : '';
    
    setErrors({
      email: emailError,
      messaggio: messaggioError
    });
    
    // Se ci sono errori, non inviare il form
    if (emailError || messaggioError) {
      return;
    }
    
    // Qui si può aggiungere la logica per inviare il form
    // Form inviato con successo
    alert('Messaggio inviato con successo!');
    
    // Reset del form
    setFormData({
      nome: '',
      cognome: '',
      telefono: '',
      email: '',
      oggetto: '',
      messaggio: '',
      privacy: false
    });
  };

  return (
    <>
      <div
        className={`home-container ${isMobile ? "mobile" : "desktop"} ${
          accessMode.largeText ? "large-text-mode" : ""
        } ${accessMode.highContrast ? "high-contrast-mode" : ""}`}
      >
        {/* HERO SECTION */}
        <section className="hero">
          <div className="hero-content">
            <div className="hero-text">
              <h1>
                Servizi Facili 50+
              </h1>
              <h2>
                Tutto quello che ti serve online, spiegato passo passo
              </h2>
              <h3>
                Tutti i servizi pubblici e utili a portata di mano, in modo
                semplice e chiaro.
              </h3>
              <div className="hero-buttons">
                <button onClick={() => navigate("/servizi")}>Vai ai Servizi</button>
                <button 
                  className="glossario-btn" 
                  onClick={() => navigate("/glossario")}
                >
                  Glossario Informatico
                </button>
              </div>
            </div>
            <div className="hero-image">
              <img
                src="/hero-anziani.jpg"
                alt="Persone over 50 che usano un computer con serenità"
              />
            </div>
          </div>
        </section>

        {/* COSA TROVI QUI */}
        <section className="info-cards">
          <div className="card">
            <FaLaptop className="card-icon" />
            <h2>Servizi digitali</h2>
            <p>Accedi facilmente a INPS, Agenzia delle Entrate, Poste e altri.</p>
          </div>
          <div className="card">
            <FaBookOpen className="card-icon" />
            <h2>Guide passo passo</h2>
            <p>
              Spiegazioni chiare con esempi pratici per usare i servizi senza
              difficoltà.
            </p>
          </div>
          <div className="card">
            <FaSearch className="card-icon" />
            <h2>Glossario informatico</h2>
            <p>Significato semplice dei termini digitali più usati.</p>
          </div>
        </section>

        {/* FEATURED GUIDE */}
        <section className="featured-guide">
          <div className="featured-content">
            <div className="featured-text">
              <h2>Non sai da dove iniziare?</h2>
              <p>Leggi la nostra guida introduttiva per orientarti subito.</p>
              <button onClick={() => navigate("/guide")}>Leggi la guida</button>
            </div>
            <div className="featured-image">
              <img
                src="/guida-introduttiva.png"
                alt="Illustrazione di una guida passo passo"
              />
            </div>
          </div>
        </section>

        {/* COME FUNZIONA */}
        <section className="how-it-works">
          <h2>Come funziona</h2>
          <ol>
            <li>Scegli il servizio che ti serve</li>
            <li>Segui le istruzioni guidate</li>
            <li>Completa facilmente la tua operazione</li>
          </ol>
        </section>

        {/* NEWS / AVVISI */}
        <section className="news">
          <h2>Novità e avvisi utili</h2>
          <ul>
            <li>Scadenza dichiarazione dei redditi: 30 settembre</li>
            <li> Nuovi bonus per pensionati disponibili</li>
            <li>Aggiornamenti SPID: maggiore sicurezza</li>
          </ul>
        </section>
      </div>

      {/* FOOTER - Fuori dal container principale */}
      <footer className="footer">
        <div className="footer-container">
          {/* FORM */}
          <div className="footer-form">
            <h2>Contattaci</h2>
            <form onSubmit={handleSubmit}>
              <input 
                type="text" 
                name="nome"
                placeholder="Nome" 
                value={formData.nome}
                onChange={handleInputChange}
                required 
              />
              <input 
                type="text" 
                name="cognome"
                placeholder="Cognome" 
                value={formData.cognome}
                onChange={handleInputChange}
                required 
              />
              <input 
                type="tel" 
                name="telefono"
                placeholder="Telefono" 
                value={formData.telefono}
                onChange={handleInputChange}
              />
              <div className="form-field">
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email *" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              <input 
                type="text" 
                name="oggetto"
                placeholder="Oggetto" 
                value={formData.oggetto}
                onChange={handleInputChange}
                required 
              />
              <div className="form-field">
                <textarea 
                  name="messaggio"
                  placeholder="Messaggio *" 
                  rows={4} 
                  value={formData.messaggio}
                  onChange={handleInputChange}
                  required
                  className={errors.messaggio ? 'error' : ''}
                ></textarea>
                {errors.messaggio && <span className="error-message">{errors.messaggio}</span>}
              </div>

              <label className="privacy-check">
                <input 
                  type="checkbox" 
                  name="privacy"
                  checked={formData.privacy}
                  onChange={handleInputChange}
                  required 
                />
                Con l'invio del presente modulo autorizzo il trattamento dei
                miei dati personali (ai sensi del GDPR 2016/679/UE).
              </label>

              <button type="submit">Invia</button>
            </form>
          </div>

          {/* INFO */}
          <div className="footer-info">
            <h2>Sede legale</h2>
            <p>Via Roma 123, Bari</p>
            <iframe
              title="Mappa sede"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2970.00126123455!2d12.480997975560951!3d41.89282996449258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132f604b502e29e7%3A0xe89d47e31326b0dc!2sComune%20di%20Roma%20Capitale!5e0!3m2!1sit!2sit!4v1759339169423!5m2!1sit!2sit"
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

            <h2>Contatti</h2>
            <p>Telefono: 080-123456</p>
            <p>Supporto: supporto@servizifacili50+.it</p>

            <h2>Orari</h2>
            <p>Lunedì – Venerdì</p>
            <p>9:00 – 13:00 | 14:00 – 19:00</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 Servizi Facili 50+</p>
        </div>
      </footer>
    </>
    );
});

export default Home;
