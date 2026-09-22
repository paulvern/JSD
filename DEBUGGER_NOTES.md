# JSD — debugger v0.2.1

Questa release cambia la politica di debug per privilegiare le prestazioni: **gli emulatori con debugger Hub partono con `DBG OFF`; i nuovi core integrati mantengono la diagnostica nativa con monitor/trace non attivi di default quando previsto**.

## Regola di prestazione

Quando `DBG OFF`:

- nessun wrapper viene installato su CPU `step()` o bus memoria nei core con debugger universale;
- nessun timer del debugger universale viene creato;
- Mega Drive, NES e Vectrex ripristinano i metodi originali se erano stati agganciati;
- PC Engine non controlla breakpoint e non registra trace;
- SNES non esegue trace, loop sampling o refresh live del debugger;
- il solo costo residuo è il pulsante UI `DBG OFF`.

Quando `DBG ON`, le funzioni di diagnostica tornano disponibili. Lo stato non viene salvato: a ogni nuova apertura l'emulatore riparte sempre con debugger spento.

## Core preservati

Le classi hardware di Mega Drive (`Bus`, `M68K`, `MegaDrive`), NES (`CPU`, `NES`) e Vectrex (`JSVectrexCore`, `MC6809`, `VecxMachine`) sono rimaste byte-per-byte identiche alla v0.2.0. Le modifiche riguardano solo il livello debugger/UI.

## Debugger universale

ColecoVision, GB/GBC/GBA, Intellivision, MSX1, Neo Geo, SMS/Game Gear e ZX Spectrum usano ora inizializzazione lazy. `JSDUniversalDebugger.attach()` registra solo la configurazione e crea il piccolo pulsante OFF; l'istanza reale nasce soltanto premendo ON. Disattivando il debugger vengono rimossi timer, listener tastiera e wrapper dinamici.

## Debugger specifici

- **Mega Drive / NES / Vectrex:** master toggle esterno, zero hook quando OFF.
- **PC Engine:** `debugEnabled` disabilita breakpoint e trace nel percorso CPU quando OFF.
- **SNES:** master toggle disabilita trace, loop sampling e refresh diagnostico live; Performance Mode resta forzata quando OFF.
