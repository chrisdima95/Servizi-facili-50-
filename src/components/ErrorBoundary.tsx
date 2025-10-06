// Intercetta gli errori che si verificano nei componenti figli e previene il crash dell'intera applicazione
import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Aggiorna lo state per mostrare l'UI di fallback
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) { // Cattura gli errori
    
    console.error('ErrorBoundary caught an error:', error, errorInfo); // Log dell'errore
    
    // Se è un errore di caricamento dinamico, prova a ricaricare la pagina
    if (error.message.includes('Failed to fetch dynamically imported module')) {
      console.warn('Errore di caricamento dinamico rilevato, tentativo di ricaricamento...');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  render() {
    if (this.state.hasError) {
      // Controlla se è un errore di caricamento dinamico
      const isDynamicImportError = this.state.error?.message.includes('Failed to fetch dynamically imported module');
      
      // Puoi renderizzare qualsiasi UI di fallback personalizzata
      return this.props.fallback || (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          margin: '20px'
        }}>
          <h2>Ops! Qualcosa è andato storto</h2>
          {isDynamicImportError ? (
            <p>Problema di caricamento del modulo. La pagina si ricaricherà automaticamente...</p>
          ) : (
            <p>Si è verificato un errore imprevisto. Per favore riprova.</p>
          )}
          <button 
            onClick={() => this.setState({ hasError: false, error: undefined })}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Riprova
          </button>
          {import.meta.env.DEV && this.state.error && (
            <details style={{ marginTop: '20px', textAlign: 'left' }}>
              <summary>Dettagli errore (solo in sviluppo)</summary>
              <pre style={{ 
                backgroundColor: '#f1f3f4', 
                padding: '10px', 
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '12px'
              }}>
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
