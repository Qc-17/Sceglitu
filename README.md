# 📖 Sceglitu

**Sceglitu** è una web app per leggere, creare e gestire storie interattive in formato JSON.
Funziona nel browser, salva dati in locale e può sincronizzare automaticamente le storie pubblicate nella repository.

🔗 **Demo:** https://qc-17.github.io/Sceglitu

---

## Funzionalità principali

- 📚 **Libreria storie locale** (localStorage)
- 🔄 **Sync automatico da GitHub** dei file `.json` nella root della repo
- 📖 **Reader con progresso** (riprendi dall’ultima pagina)
- ✍️ **Import rapido JSON** (incolla o carica file)
- 🧱 **Editor visuale dedicato** (`editor.html`) per costruire storie a blocchi
- 🌍 **Interfaccia multilingua** (IT/EN) con filtro storie per lingua
- 🎨 **Tema scuro/chiaro** (gestito dalle impostazioni)
- 🧪 **Pagine accessorie**: tutorial, impostazioni, login/profilo (facoltativi)

---

## Struttura del progetto

```text
Sceglitu/
├── index.html              # Home + reader + import JSON
├── editor.html             # Editor visuale completo
├── tutorial.html           # Tutorial iniziale
├── impostazioni.html       # Impostazioni app (tema, lingua, backup, link utili)
├── login.html              # Login/signup opzionale (Supabase)
├── profilo.html            # Profilo utente
├── cifrario.html           # Utility separata
├── style.css               # Stili principali
├── dark.css                # Tema dark
├── js/
│   ├── app.js              # Stato globale + init
│   ├── home.js             # Render libreria storie
│   ├── reader.js           # Logica lettura e scelte
│   ├── editor.js           # Import/salvataggio storie
│   ├── storage.js          # Persistenza locale (+ hook Supabase)
│   ├── github.js           # Sync da repository GitHub
│   ├── i18n.js             # Traduzioni UI
│   ├── modal.js            # Modal JSON/copia
│   └── external-links.js   # Gestione link esterni
├── villa_morvell.json
├── villa_morvell_en.json
└── README.md
```

---

## Formato JSON delle storie

Ogni storia deve avere almeno:

```json
{
  "titolo": "Titolo storia",
  "pagine": [
    {
      "numeroPagina": 1,
      "testo": "Testo iniziale",
      "scelte": [
        { "testo": "Vai avanti", "vaiAllaPagina": 2 }
      ]
    },
    {
      "numeroPagina": 2,
      "testo": "Fine percorso",
      "scelte": []
    }
  ]
}
```

Campi opzionali supportati e mostrati in UI:

- `autore`
- `anno`
- `genere`
- `lingua`

### Regole minime

- `titolo`: stringa univoca
- `pagine`: array non vuoto
- `numeroPagina`: intero univoco per ogni pagina
- `scelte[].vaiAllaPagina`: deve puntare a una pagina esistente
- `scelte: []` indica una fine narrativa

---

## Avvio in locale

Puoi aprire i file direttamente nel browser, ma per avere il comportamento più vicino alla demo (fetch/sync), è consigliato un server locale.

```bash
git clone https://github.com/Qc-17/Sceglitu.git
cd Sceglitu
python3 -m http.server 8000
```

Poi apri: `http://localhost:8000`

---

## Sincronizzazione storie da GitHub

All’avvio, l’app controlla i `.json` nella root della repository `Qc-17/Sceglitu` (branch `main`) e importa/aggiorna quelli cambiati.

- Chiave locale usata per tracciare gli SHA sincronizzati: `sceglitu_github_synced_v1`
- Le storie sincronizzate vengono salvate in `sceglitu_stories_v1`

---

## Storie incluse

| File | Titolo | Lingua | Pagine |
|---|---|---|---:|
| `villa_morvell.json` | Il Labirinto di Villa Morvell | italiano | 100 |
| `villa_morvell_en.json` | The Labyrinth of Villa Morvell | english | 100 |

---

## Licenza

Progetto distribuito sotto **GPL-3.0**.

© [Qc-17](https://github.com/Qc-17)
