# 🤖 Chatbot AI per Servizi Facili 50+

## 📋 Panoramica

Il chatbot è stato implementato come assistente digitale completamente **frontend-only** per aiutare gli anziani a navigare nei servizi pubblici digitali. Non richiede backend o database esterni.

## ✨ Funzionalità Principali

### 🎯 **Fase 1 - Funzionalità Base**
- ✅ **ChatbotFab**: Pulsante floating sempre visibile in basso a destra
- ✅ **ChatbotWindow**: Interfaccia chat completa e accessibile
- ✅ **Pattern Matching**: Riconoscimento di 15+ intenti principali
- ✅ **Navigazione Integrata**: Collegamento diretto con il routing dell'app

### 🚀 **Fase 2 - Funzionalità Avanzate**
- ✅ **Wizard Guidati**: 3 wizard completi per operazioni complesse
  - Domanda di pensione INPS
  - Prenotazione visite sanitarie
  - Ottenimento SPID
- ✅ **Evidenziazione UI**: Highlighting automatico degli elementi
- ✅ **Persistenza**: Salvataggio preferenze e stato in localStorage

### 🎨 **Fase 3 - Raffinamenti**
- ✅ **Risposte Personalizzate**: Messaggi basati su nome utente e cronologia
- ✅ **Integrazione SearchContext**: Ricerca intelligente nei servizi
- ✅ **Accessibilità Completa**: ARIA labels, navigazione da tastiera, screen reader

## 🧠 Intelligenza del Chatbot

### **Pattern Matching Avanzato**
```javascript
// Esempi di riconoscimento
"domanda pensione" → Wizard pensione INPS
"prenotare visita" → Wizard sanità
"cos'è SPID" → Spiegazione + wizard SPID
"non riesco" → Supporto emotivo + aiuto
```

### **Rilevamento Emotivo**
- **Frustrazione**: Rileva "non funziona", "non riesco" → Supporto empatico
- **Successo**: Rileva "grazie", "perfetto" → Celebrazione + nuove opzioni

### **Personalizzazione Intelligente**
- Saluta con nome utente e orario appropriato
- Suggerimenti basati sui servizi più usati
- Quick replies personalizzate per la cronologia

## 🎛️ Componenti Implementati

### **Core Components**
- `ChatbotFab.tsx` - Pulsante floating con animazioni
- `ChatbotWindow.tsx` - Finestra chat principale
- `ChatbotMessage.tsx` - Rendering messaggi con markdown
- `ChatbotInput.tsx` - Input con auto-resize e validazione

### **Data & Logic**
- `useChatbot.ts` - Hook principale con tutta la logica
- `chatbotRules.ts` - Regole di pattern matching e FAQ
- `chatbotWizards.ts` - Wizard guidati step-by-step
- `chatbotHelpers.ts` - Messaggi di supporto e consigli

## 🎨 Stili e Accessibilità

### **Design Responsive**
- Mobile-first con breakpoint a 768px
- Finestra chat adattiva su dispositivi piccoli
- Touch-friendly con pulsanti grandi

### **Accessibilità Completa**
- ARIA labels e roles appropriati
- Navigazione da tastiera (ESC per chiudere)
- Supporto screen reader
- Alto contrasto e testo grande integrati

### **Animazioni Fluide**
- Slide-up per apertura finestra
- Typing indicator animato
- Highlight effect per elementi UI
- Hover states e feedback visivi

## 🔧 Integrazione con l'App Esistente

### **Context Integration**
- `SearchContext` per ricerca globale
- `UserContext` per personalizzazione
- `AccessibilityFab` posizionamento coordinato

### **Routing Integration**
- Navigazione automatica alle pagine pertinenti
- Evidenziazione elementi specifici
- Supporto per tutti i servizi esistenti

## 📊 Funzionalità per Anziani

### **Supporto Emotivo**
- Messaggi di incoraggiamento casuali
- Rilevamento frustrazione → Supporto immediato
- Celebrazione dei successi
- Linguaggio semplice e paziente

### **Spiegazioni Semplificate**
- Analogie comprensibili ("SPID è come la chiave di casa")
- Termini tecnici spiegati in modo semplice
- Consigli pratici per l'uso del computer

### **Sicurezza e Protezione**
- Consigli anti-truffa specifici
- Educazione sui siti sicuri
- Promemoria di sicurezza contestuali

## 🚀 Come Usare il Chatbot

### **Per l'Utente Finale**
1. Clicca sull'icona del chatbot in basso a destra
2. Scrivi la tua domanda in linguaggio naturale
3. Usa i pulsanti di risposta rapida per navigare
4. Segui i wizard per operazioni complesse

### **Esempi di Conversazioni**
```
👤 "Come faccio la domanda di pensione?"
🤖 Avvia wizard pensione → Controlla SPID → Guida documenti → Naviga INPS

👤 "Non capisco cos'è lo SPID"
🤖 Spiegazione semplice → Offre wizard per ottenerlo → Guida Poste

👤 "Non riesco ad accedere"
🤖 Rileva frustrazione → Supporto emotivo → Aiuto specifico
```

## 🔧 Configurazione e Personalizzazione

### **Aggiungere Nuovi Intenti**
Modifica `chatbotRules.ts`:
```javascript
newIntent: {
  patterns: ['parola1', 'parola2'],
  responses: ['Risposta del bot'],
  actions: ['navigateToPage'],
  followUp: ['Domande successive']
}
```

### **Creare Nuovi Wizard**
Modifica `chatbotWizards.ts`:
```javascript
newWizard: {
  id: 'wizard_id',
  name: 'Nome Wizard',
  startStep: 'primo_step',
  steps: { /* definizione step */ }
}
```

### **Personalizzare Messaggi**
Modifica `chatbotHelpers.ts` per aggiungere:
- Nuovi messaggi di incoraggiamento
- Spiegazioni semplificate
- Consigli di sicurezza
- Tips pratici

## 📈 Metriche e Analytics

Il chatbot traccia automaticamente:
- Servizi più utilizzati (localStorage)
- Preferenze utente (detailLevel, favoriteServices)
- Stato wizard (ripristino automatico)
- Cronologia conversazioni (sessione corrente)

## 🎯 Benefici per gli Anziani

1. **Riduce l'Ansia**: Assistente paziente sempre disponibile
2. **Aumenta l'Autonomia**: Guida step-by-step senza giudizio
3. **Migliora la Sicurezza**: Educazione anti-truffa integrata
4. **Personalizza l'Esperienza**: Si adatta al livello di ogni utente
5. **Fornisce Supporto Emotivo**: Incoraggiamento e celebrazione progressi

## 🔮 Possibili Estensioni Future

- **Sintesi vocale** per lettura messaggi
- **Riconoscimento vocale** per input parlato
- **Tutorial interattivi** con screenshot
- **Modalità offline** con cache avanzata
- **Integrazione WhatsApp** per supporto esterno

---

**Il chatbot è ora completamente funzionale e integrato nell'app Servizi Facili 50+!** 🎉
