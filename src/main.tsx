// Entry point dell'applicazione: configurazione React Router e rendering dell'app principale
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// Disabilita lo scroll restoration del browser globalmente - OTTIMIZZATO
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Crea il root dell'applicazione
const root = ReactDOM.createRoot(document.getElementById("root")!); // ! per indicare che l'elemento root esiste

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
