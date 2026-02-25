# 📖 Sceglitu

**Sceglitu** è un'app web per leggere, creare e condividere storie interattive in formato JSON.  
Funziona interamente nel browser — nessun server, nessuna installazione, nessun account.

🔗 **[Apri Sceglitu](https://qc-17.github.io/Sceglitu)** ← *(GitHub Pages)*

---

## Funzionalità

- 📚 **Libreria personale** — le storie restano salvate nel browser (localStorage)
- 🔄 **Sincronizzazione automatica** — i file `.json` presenti in questa repo vengono importati automaticamente all'apertura del sito
- ✍️ **Editor integrato** — crea o importa storie incollando JSON o caricando un file
- 💾 **Salvataggio del progresso** — la lettura riprende dall'ultima pagina visitata
- 📋 **Esporta JSON** — copia il JSON di qualsiasi storia direttamente dall'app

---

## Struttura del progetto

```
Sceglitu/
├── index.html            ← l'intera app (HTML + CSS + JS in un file solo)
├── villa_morvell.json    ← storia inclusa di default
├── README.md
└── *.json                ← altre storie (vengono importate automaticamente)
```

> Tutti i file `.json` nella root della repo vengono rilevati e importati automaticamente dal sito al primo avvio (e aggiornati se cambiano).

---

## Formato delle storie

Le storie sono file `.json` con questa struttura:

```json
{
  "titolo": "Titolo della storia",
  "pagine": [
    {
      "numeroPagina": 1,
      "testo": "Testo della pagina. Può essere lungo quanto vuoi.",
      "scelte": [
        { "testo": "Prima scelta", "vaiAllaPagina": 2 },
        { "testo": "Seconda scelta", "vaiAllaPagina": 3 }
      ]
    },
    {
      "numeroPagina": 2,
      "testo": "Hai scelto la prima via. Qui finisce questo percorso.",
      "scelte": []
    },
    {
      "numeroPagina": 3,
      "testo": "Hai scelto la seconda via. La storia continua...",
      "scelte": [
        { "testo": "Torna all'inizio", "vaiAllaPagina": 1 }
      ]
    }
  ]
}
```

### Regole

| Campo | Tipo | Obbligatorio | Note |
|---|---|---|---|
| `titolo` | stringa | ✅ | Deve essere unico tra le storie |
| `pagine` | array | ✅ | Almeno una pagina |
| `numeroPagina` | intero | ✅ | Non deve essere sequenziale, ma deve essere unico |
| `testo` | stringa | ✅ | Nessun limite di lunghezza |
| `scelte` | array | ✅ | Array vuoto `[]` = fine del percorso |
| `scelte[].testo` | stringa | ✅ | Testo del pulsante di scelta |
| `scelte[].vaiAllaPagina` | intero | ✅ | Deve corrispondere a un `numeroPagina` esistente |

### Consigli

- Le pagine **non devono** essere in ordine numerico nell'array — l'app le cerca per `numeroPagina`
- Una pagina può rimandare a **se stessa** (loop)
- Puoi avere **più pagine finali** (con `scelte: []`) per percorsi diversi
- Il `numeroPagina` della prima pagina da cui parte la storia è sempre **1**

---

## Come contribuire con una storia

1. **Forka** questa repository
2. Crea il tuo file `nome_storia.json` nella root seguendo il formato sopra
3. Apri una **Pull Request** con una breve descrizione della storia

Oppure, se non vuoi usare Git:

1. Apri una **Issue** con il titolo `[STORIA] Nome della tua storia`
2. Incolla il JSON nel corpo dell'issue

---

## Come usare il sito in locale

Basta aprire `index.html` in un browser moderno. Non servono server o dipendenze.

```bash
git clone https://github.com/Qc-17/Sceglitu.git
cd Sceglitu
# apri index.html con il tuo browser preferito
```

> **Nota:** la sincronizzazione automatica da GitHub richiede una connessione internet e non funziona tramite il protocollo `file://` a causa delle restrizioni CORS. Usa un server locale (`python3 -m http.server`) oppure apri direttamente il sito su GitHub Pages.

---

## Storie incluse

| File | Titolo | Pagine | Note |
|---|---|---|---|
| `villa_morvell.json` | Il Labirinto di Villa Morvell | 100 | Una sola fine possibile, 179 scelte |

---

## Licenza

Distribuito sotto licenza **GPL 3.0**.  
© [Qc-17](https://github.com/Qc-17)

Le storie incluse nella repository sono distribuite sotto la stessa licenza, salvo diversa indicazione nel file stesso.
