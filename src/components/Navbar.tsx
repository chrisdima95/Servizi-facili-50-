// Barra di navigazione principale
import React, { useCallback, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import SearchBar from "./SearchBar";
import "../styles/Navbar.css";

interface NavbarProps {
  isMobile?: boolean;
}

// Componente per la barra di navigazione principale
const Navbar: React.FC<NavbarProps> = React.memo(({ isMobile = false }) => { // Componente memoizzato per migliorare le prestazioni
  const navigate = useNavigate(); 
  const { isAuthenticated, user } = useUser(); // Controllo se l'utente è autenticato e recupera le informazioni dell'utente
  const label = isAuthenticated ? `👤 ${user?.username}` : "👤 Profilo"; // Label per il pulsante profilo

  // Stati per il menu hamburger
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false); // Controllo se il menu hamburger è aperto
  const [isAnimating, setIsAnimating] = useState(false); // Controllo se l'animazione è in corso
  const hamburgerMenuRef = useRef<HTMLDivElement>(null); // Ref per il menu hamburger
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null); // Ref per il pulsante hamburger

  // Ottimizzazione: memoizza le funzioni di navigazione
  const navigateHome = useCallback(() => navigate("/"), [navigate]); // Funzione per navigare alla home
  const navigateServizi = useCallback(() => navigate("/servizi"), [navigate]); // Funzione per navigare ai servizi
  const navigateGuide = useCallback(() => navigate("/guide"), [navigate]); // Funzione per navigare alle guide
  const navigateProfilo = useCallback(() => navigate("/profilo"), [navigate]); // Funzione per navigare al profilo

  // Funzioni di navigazione per il menu hamburger (con chiusura automatica)
  const navigateHomeHamburger = useCallback(() => {
    navigate("/"); // Navigazione alla home
    closeHamburgerMenu(); // Chiusura del menu hamburger
  }, [navigate]); 
  
  // Funzione per navigare ai servizi nel menu hamburger
  const navigateServiziHamburger = useCallback(() => { 
    navigate("/servizi");
    closeHamburgerMenu();
  }, [navigate]);
  
  // Funzione per navigare alle guide nel menu hamburger
  const navigateGuideHamburger = useCallback(() => {
    navigate("/guide");
    closeHamburgerMenu();
  }, [navigate]);
  
  // Funzione per navigare al profilo nel menu hamburger
  const navigateProfiloHamburger = useCallback(() => {
    navigate("/profilo");
    closeHamburgerMenu();
  }, [navigate]);

  // Funzioni per gestire il menu hamburger
  const toggleHamburgerMenu = useCallback(() => {
    if (isAnimating) return; // Previene click multipli durante l'animazione
    
    setIsAnimating(true);
    
    if (isHamburgerOpen) {
      closeHamburgerMenu();
    } else {
      openHamburgerMenu();
    }
    
    // Riabilita il pulsante più velocemente per evitare blocchi
    setTimeout(() => {
      setIsAnimating(false);
    }, 150);
  }, [isHamburgerOpen, isAnimating]);

  const openHamburgerMenu = useCallback(() => {
    setIsHamburgerOpen(true);
    
    // Calcola dinamicamente l'altezza della navbar
    const navbar = document.querySelector('.navbar') as HTMLElement;
    const navbarHeight = navbar ? navbar.offsetHeight : 80;
    
    // Imposta l'altezza corretta del menù hamburger
    if (hamburgerMenuRef.current) {
      hamburgerMenuRef.current.style.top = `${navbarHeight}px`;
      hamburgerMenuRef.current.style.height = `calc(100vh - ${navbarHeight}px)`;
    }
    
    // Imposta anche l'overlay alla stessa altezza
    const overlay = document.querySelector('.hamburger-overlay') as HTMLElement;
    if (overlay) {
      overlay.style.top = `${navbarHeight}px`;
    }
    
    // Salva la posizione di scroll corrente per ripristinarla dopo
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    
    // Nasconde completamente la scrollbar
    document.body.style.overflow = 'hidden';
    document.body.style.overflowY = 'hidden';
    document.body.style.overflowX = 'hidden';
    
    // Aggiunge le classi CSS
    document.body.classList.add('hamburger-menu-open');
    document.documentElement.classList.add('hamburger-menu-open');
    
  }, []);

  // Funzione per chiudere il menu hamburger
  const closeHamburgerMenu = useCallback(() => {
    setIsHamburgerOpen(false);
    
    // Ripristina gli stili del menù hamburger
    if (hamburgerMenuRef.current) {
      hamburgerMenuRef.current.style.top = '';
      hamburgerMenuRef.current.style.height = '';
    }
    
    // Ripristina l'overlay
    const overlay = document.querySelector('.hamburger-overlay') as HTMLElement;
    if (overlay) {
      overlay.style.top = '';
    }
    
    // Ripristina la posizione di scroll
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    
    // Ripristina la scrollbar del body
    document.body.style.overflow = '';
    document.body.style.overflowY = '';
    document.body.style.overflowX = '';
    
    // Ripristina la posizione di scroll
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    
    // Rimuove le classi CSS
    document.body.classList.remove('hamburger-menu-open');
    document.documentElement.classList.remove('hamburger-menu-open');
    
    // Ritorna il focus al pulsante hamburger
    setTimeout(() => {
      if (hamburgerButtonRef.current) {
        hamburgerButtonRef.current.focus();
      }
    }, 300);
  }, []);

  // Gestione chiusura con ESC
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isHamburgerOpen) {
        closeHamburgerMenu();
      }
    };

    if (isHamburgerOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isHamburgerOpen, closeHamburgerMenu]);

  // Gestione click fuori dal menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isHamburgerOpen && hamburgerMenuRef.current && !hamburgerMenuRef.current.contains(event.target as Node) && 
          hamburgerButtonRef.current && !hamburgerButtonRef.current.contains(event.target as Node)) {
        // Solo chiudi se non stiamo animando
        if (!isAnimating) {
          closeHamburgerMenu();
        }
      }
    };

    if (isHamburgerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isHamburgerOpen, isAnimating, closeHamburgerMenu]);

  // Cleanup al dismount
  useEffect(() => {
    return () => {
      // Ripristina gli stili del menù hamburger
      if (hamburgerMenuRef.current) {
        hamburgerMenuRef.current.style.top = '';
        hamburgerMenuRef.current.style.height = '';
      }
      
      // Ripristina l'overlay
      const overlay = document.querySelector('.hamburger-overlay') as HTMLElement;
      if (overlay) {
        overlay.style.top = '';
      }
      
      // Ripristina completamente il body
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.style.overflowY = '';
      document.body.style.overflowX = '';
      
      // Rimuove le classi
      document.body.classList.remove('hamburger-menu-open');
      document.documentElement.classList.remove('hamburger-menu-open');
    };
  }, []);

  // Componente Logo integrato nella Navbar
  const Logo = ({ className = '', onClick }: { className?: string; onClick?: () => void }) => {
    return (
      <div 
        className={`logo-container ${className}`}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        aria-label={onClick ? "Torna alla home" : "Logo Servizi Facili 50+"}
      >
        <svg
          width="280"
          height="60"
          viewBox="0 0 280 60"
          className="logo-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background circle with gradient */}
          <defs>
            <linearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
            <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e74c3c" />
              <stop offset="100%" stopColor="#c0392b" />
            </linearGradient>
            <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffdd99" />
              <stop offset="100%" stopColor="#ffb703" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Background circle */}
          <circle
            cx="30"
            cy="30"
            r="28"
            fill="url(#backgroundGradient)"
            filter="url(#glow)"
          />
          
          {/* Heart icon */}
          <path
            d="M20 25 C20 20, 25 20, 30 25 C35 20, 40 20, 40 25 C40 30, 30 40, 30 40 C30 40, 20 30, 20 25 Z"
            fill="url(#heartGradient)"
          />
          
          {/* Star icon */}
          <path
            d="M30 15 L32 21 L38 21 L33 25 L35 31 L30 27 L25 31 L27 25 L22 21 L28 21 Z"
            fill="url(#starGradient)"
          />
          
          {/* Text "Servizi Facili" */}
          <text
            x="70"
            y="25"
            className="logo-text-main"
            fill="#ffffff"
            fontSize="18"
            fontWeight="700"
            fontFamily="Arial, sans-serif"
          >
            Servizi Facili
          </text>
          
          {/* Text "50+" with special styling */}
          <text
            x="70"
            y="45"
            className="logo-text-age"
            fill="#ffb703"
            fontSize="20"
            fontWeight="900"
            fontFamily="Arial, sans-serif"
          >
            50+
          </text>
          
        </svg>
      </div>
    );
  };

  return (
    <>
      {/* Navbar sempre visibile - desktop e mobile */}
      <nav className="navbar" aria-label="Navigazione principale">
        {isMobile && (
          <div className="navbar-hamburger-container">
            {/* Pulsante Hamburger */}
            <button
              ref={hamburgerButtonRef}
              className={`hamburger-menu-button ${isHamburgerOpen ? 'open' : ''}`}
              onClick={toggleHamburgerMenu}
              aria-label={isHamburgerOpen ? 'Chiudi menu' : 'Apri menu'}
              aria-expanded={isHamburgerOpen}
              aria-controls="hamburger-menu"
              disabled={isAnimating}
            >
              {isHamburgerOpen ? (
                <div className="arrow-icon">
                  <span className="arrow-left">←</span>
                </div>
              ) : (
                <div className="hamburger-icon">
                  <span className="hamburger-line"></span>
                  <span className="hamburger-line"></span>
                  <span className="hamburger-line"></span>
                </div>
              )}
            </button>
          </div>
        )}
        <div className="navbar-brand">
          <Logo onClick={navigateHome} />
        </div>
        {!isMobile && (
          <>
            <div className="navbar-buttons">
              <button className="footer-btn" aria-label="Home" onClick={navigateHome}> Home</button>
              <button className="footer-btn" aria-label="Servizi" onClick={navigateServizi}> Servizi</button>
              <button className="footer-btn" aria-label="Guide" onClick={navigateGuide}> Guide</button>
              <button className="footer-btn" aria-label="Profilo" onClick={navigateProfilo}>{label}</button>
            </div>
            <div className="navbar-search">
              <SearchBar isMobile={isMobile} />
            </div>
          </>
        )}
        {isMobile && (
          <div className="navbar-mobile-actions">
            <div className="navbar-search">
              <SearchBar isMobile={isMobile} />
            </div>
          </div>
        )}
      </nav>

      {/* Menu Hamburger - Solo su mobile */}
      {isMobile && (
        <>
          {/* Overlay */}
          {isHamburgerOpen && (
            <div 
              className="hamburger-overlay"
              onClick={closeHamburgerMenu}
              aria-hidden="true"
            />
          )}

          {/* Menu */}
          <div
            ref={hamburgerMenuRef}
            id="hamburger-menu"
            className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''}`}
            role="navigation"
            aria-label="Menu di navigazione principale"
          >
            {/* Navigazione - Stessa dei pulsanti navbar */}
            <nav className="hamburger-nav" aria-label="Menu principale">
              <button 
                className="hamburger-nav-item"
                onClick={navigateHomeHamburger}
                aria-label="Home"
              >
                <span className="nav-icon nav-icon-home"></span>
                <span className="nav-text">Home</span>
              </button>
              
              <button 
                className="hamburger-nav-item"
                onClick={navigateServiziHamburger}
                aria-label="Servizi"
              >
                <span className="nav-icon nav-icon-servizi"></span>
                <span className="nav-text">Servizi</span>
              </button>
              
              <button 
                className="hamburger-nav-item"
                onClick={navigateGuideHamburger}
                aria-label="Guide"
              >
                <span className="nav-icon nav-icon-guide"></span>
                <span className="nav-text">Guide</span>
              </button>
              
              <button 
                className="hamburger-nav-item"
                onClick={navigateProfiloHamburger}
                aria-label="Profilo"
              >
                <span className="nav-icon">👤</span>
                <span className="nav-text">{isAuthenticated ? user?.username : 'Profilo'}</span>
              </button>
            </nav>

            {/* Footer del menu */}
            <div className="hamburger-menu-footer">
              <p className="menu-footer-text">
                Servizi Facili 50+ - Navigazione semplificata
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
