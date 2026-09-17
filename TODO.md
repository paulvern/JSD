# JSD Emulator Hub — TODO ragionato

Questo documento ordina il lavoro per **impatto tecnico**, non per facilità di implementazione.

## Priorità

- **P0 — necessario:** bug che bloccano giochi, persistenza dati, regressioni, dipendenze o architettura che impediscono di far crescere il progetto in modo affidabile.
- **P1 — importante:** accuratezza, compatibilità, strumenti e usabilità che aumentano molto il valore reale dell'emulatore.
- **P2 — evolutivo:** analisi avanzata, rifiniture, feature di laboratorio e comodità non essenziali.

---

# Interfaccia generale / Hub

## P0

### 1. Test di regressione automatici per ogni core
**Perché:** oggi una correzione su grafica, timing o debugger può far regredire un gioco che prima funzionava.

Creare una piccola suite per sistema con:
- ROM homebrew/test ROM quando disponibili;
- hash della ROM;
- boot atteso;
- PC/registri dopo N frame;
- checksum framebuffer o screenshot di riferimento;
- eventuale checksum RAM/audio events.

Il test non deve richiedere input manuale.

### 2. Rendere vincolante il formato single-file
**Perché:** il valore del progetto è poter usare ogni core anche fuori dall'Hub.

Regola di release:
- ogni emulatore deve funzionare copiando **solo il suo `.html`**;
- niente `<script src=...>` necessario al core;
- niente CDN o moduli remoti obbligatori;
- ROM, BIOS, save e media vengono caricati dall'emulatore stesso;
- un test automatico deve aprire ogni HTML senza gli altri file dell'Hub e verificare che non produca errori di dipendenze mancanti.

Il launcher deve restare leggero: riconosce/suggerisce una piattaforma, apre il file corretto e può consegnare ROM/BIOS tramite il ricevitore JSD Hub opzionale incorporato. Il core non deve mai dipendere dal launcher.

### 3. Debugger universale come sorgente comune, ma inlined
**Perché:** serve coerenza fra i debugger senza sacrificare l'autonomia dei file.

Mantenere un sorgente comune di sviluppo con adapter per:
- PC;
- registri;
- step;
- read/write memory;
- pausa/ripresa;
- disassembly opzionale.

Durante la preparazione della release il debugger viene incorporato nell'HTML dei core che lo usano. **Nessun `universal-debugger.js` deve essere richiesto a runtime.**

### 4. Rendere esplicita la compatibilità per build
**Perché:** “funziona” è troppo ambiguo.

Aggiungere un piccolo database JSON locale:
- sistema;
- ROM/hash;
- stato: boot / intro / playable / complete;
- grafica;
- audio;
- input;
- note;
- versione core testata.

## P1

### 5. Libreria giochi
Mostrare nel launcher:
- titolo;
- piattaforma;
- ultimo avvio;
- save presente;
- compatibilità nota;
- screenshot facoltativo;
- BIOS richiesto/presente.

### 6. Save Manager v2
Unificare:
- SRAM/BRAM/Flash;
- RTC quando presente;
- import/export singolo;
- backup totale;
- metadati con hash ROM;
- migrazione chiavi localStorage vecchie.

Tenere i **save-state** in una sezione distinta.

### 7. Performance HUD comune
Per ogni core:
- fps;
- emulated cycles/s;
- tempo CPU;
- tempo video;
- tempo audio;
- debugger overhead;
- dropped frames.

Serve soprattutto per SNES, Neo Geo, GBA e Mega Drive.

### 8. Gestione errori comune
Errore strutturato con:
- sistema;
- ROM;
- PC;
- opcode;
- frame;
- stack/register dump;
- download report JSON.

## P2

### 9. Workspace `.jsd`
Salvare un progetto di reverse engineering con:
- ROM hash;
- label;
- commenti;
- breakpoint;
- regioni code/data;
- patch;
- screenshot/capture;
- note.

### 10. ROM map e call graph
Visualizzazione comune di:
- code/data;
- bank;
- entry point;
- call edges;
- IRQ/NMI vectors;
- hot paths runtime.

### 11. Live patching
Editor esadecimale con patch temporanee, diff e export IPS/BPS dove sensato.

### 12. UI coerente
Uniformare gradualmente:
- lingua IT/EN;
- fullscreen;
- CRT/scanline;
- controlli;
- import/export;
- shortcut debugger;
- naming dei pulsanti.

Non riscrivere tutti gli emulatori con un framework: mantenere HTML separati e autosufficienti. Eventuali convenzioni comuni devono essere incorporate nel file finale, non richieste come runtime condiviso.

---

# Game Boy / GBC / GBA

## P0
- **GBA: timing IRQ/DMA/timer più deterministico.** Molti giochi dipendono più dal timing che da nuovi opcode.
- **GBA: Flash/EEPROM/RTC per cartucce reali.** È necessario per save affidabili su una parte importante della libreria.

## P1
- DirectSound FIFO + DMA audio più accurati.
- Window/blending e affine OBJ completi.
- Migliorare PPU edge cases GB/GBC e sincronizzazione audio.
- Aggiungere test ROM CPU/PPU/APU al regression runner.

## P2
- Call graph ARM/Thumb misto.
- Riconoscimento automatico dati grafici non ancora caricati in VRAM.
- Editor/patched asset con export patch ROM.

---

# Master System / Game Gear

## P0
- Verificare IRQ line/frame e timing VDP con test ROM.
- Consolidare mapper Sega/Codemasters e bank switching.

## P1
- Raster effects e scroll per-linea più accurati.
- PSG noise/envelope timing e mixing.
- Portare SRAM, se presente, nel Save Manager comune.

## P2
- Tilemap editor live.
- Profilo Game Gear LCD separato dal CRT SMS.

---

# Mega Drive / Genesis

## P0
- Regressione su DMA, HBlank/VBlank e interrupt VDP.
- Validare collisioni/sprite overflow e raster timing su una suite ampia.

## P1
- YM2612: envelope, timer, DAC e comportamento busy più accurati.
- Z80 bus arbitration e handoff 68000/Z80 più fedele.
- Migliorare shadow/highlight e priorità VDP.

## P2
- Viewer plane A/B/window con tilemap interattiva.
- Trace sincronizzato 68000 + Z80 + VDP events.

---

# Neo Geo AES / MVS

## P0
- Riprodurre e correggere i blocchi di giochi complessi, in particolare la famiglia Metal Slug.
- Correggere raster IRQ / scanline effects che influenzano personaggi, ombre e layer.
- Rendere robusti read/write non allineati e accessi di protezione/cart edge cases.

## P1
- YM2610: ADPCM-A/B, timers, IRQ e mixing più accurati.
- Priorità LSPC, shadow e sprite chaining.
- Test sistematici MVS/AES e BIOS diversi.

## P2
- Trace cross-CPU 68000 ↔ Z80.
- Viewer sprite animation/chaining e palette usage.
- Analisi automatica P-ROM con call graph e regioni dati.

---

# NES / Famicom

## P0
- Aumentare la copertura mapper in modo guidato dalla libreria reale.
- Validare IRQ mapper e timing PPU/A12 sui mapper sensibili.

## P1
- Sprite 0 hit, overflow e race condition PPU più accurati.
- APU frame counter/DMC timing.
- Test automatici CPU/PPU/APU e mapper.

## P2
- CHR/nametable editor live.
- Debugger mapper-aware e visualizzazione bank corrente.

---

# SNES / Super Famicom

## P0
- **SRAM batterizzata:** localStorage + import/export `.srm` + Save Manager centrale.
- Stabilizzare DMA/HDMA, IRQ/NMI e timing scanline.
- Creare regressioni specifiche per Modes 0–7 e sprite.

## P1
- SPC700/S-DSP: timer, BRR, envelope, echo e mixing più accurati.
- Super FX: ampliare opcode/timing/accesso memoria.
- DSP-1: copertura comandi e timing.
- SA-1, S-DD1 e altri chip: dichiarare esplicitamente unsupported finché non esiste un core reale, evitando false compatibilità.
- Hires/interlace, windows, color math e mosaic edge cases.

## P2
- Viewer CGRAM/OAM/tilemap per layer.
- Trace 65C816 + SPC700 sincronizzato.
- Profilo per-frame di HDMA e registri PPU.

Nota: nella build Hub il supporto `.7z` remoto è stato rimosso per mantenere l'esecuzione offline. ZIP resta supportato.

---

# PC Engine / TurboGrafx-16

## P0
- Continuare la verifica di collisioni sprite, overflow e priorità VDC.
- Stabilizzare timer/IRQ HuC6280 e raster compare.

## P1
- PSG più fedele: noise, LFO, livelli e mixing.
- Mapper HuCard e cart RAM speciali.
- SuperGrafx come estensione separata solo dopo stabilità VDC singolo.

## P2
- CD-ROM² + ADPCM come sottoprogetto separato, non come patch rapida al core HuCard.
- Viewer BAT/SATB temporale per frame.

---

# ColecoVision

## P0
- Suite regressione Z80/TMS9918 con ROM note.
- Sistemare eventuali titoli che si fermano dopo schermata iniziale/input.

## P1
- Accuratezza VDP status/IRQ e sprite collision/overflow.
- SN76489 timing e rumore.
- Supporto controller/keypad completo e coerente.

## P2
- Mapper/espansioni meno comuni.
- Asset browser più uniforme con SMS/MSX.

---

# ZX Spectrum 48K

## P0
- Timing ULA/frame/interrupt verificato con test noti.
- Caricamento TAP robusto con fast-load opzionale senza rompere la modalità reale.

## P1
- Border timing e contention 48K.
- Beeper/tape audio più fedele.
- Snapshot compatibilità più ampia.

## P2
- Estensione 128K come core/configurazione separata.
- Visualizzazione attributi/screen editor.

---

# MSX1

## P0
- Mapper cartridge più comuni e bank switching verificato.
- Timing VDP IRQ/status e input.

## P1
- AY audio più accurato.
- Supporto cassette/dischi solo con architettura dedicata, senza simulazioni incomplete.
- Espansioni RAM/slot più fedeli.

## P2
- MSX2 come macchina distinta che riusa Z80 e infrastruttura, non come flag cosmetico.
- Asset browser VDP condivisibile con Coleco/SMS dove possibile.

---

# Intellivision

## P0
- Regression test CP1610/STIC con giochi già noti funzionanti.
- Consolidare keypad/controller e mapping input.

## P1
- Timing STIC, collisioni e bus contention.
- AY audio più accurato.
- Migliorare distinzione code/data nel disassembler.

## P2
- Call graph CP1610.
- Editor pattern/card/sprite con patch temporanea.

---

# Vectrex

## P0
- Verificare il nuovo core JavaScript originale su un set di ROM commerciali/homebrew già usato nello sviluppo.
- Correggere eventuali differenze rispetto alla build VecX precedente senza reintrodurre codice third-party.
- Validare VIA 6522: T1/T2, shift register, IFR/IER e timing IRQ.

## P1
- Modello analogico DAC/integratori: scala, zero, ramp e beam timing.
- AY-3-8912 audio più accurato.
- Rotazione/orientamento e coordinate vettori con test riproducibili.

## P2
- Save-state versionato e reimportabile.
- Analisi delle forme per routine/funzione anziché solo frame.
- Breakpoint su accessi VIA/AY.

---

# LaserDiscJSD (standalone)

## P0
- Se LaserDisc viene aggiunto al launcher, gestire un handoff dedicato ROM + video/timeline senza cambiare il requisito standalone del file HTML.
- Riconoscimento Dragon's Lair / Space Ace senza confondere ZIP ROM e video.
- Persistenza delle impostazioni di offset/timeline per hash del media.

## P1
- Verificare handshake LD-V1000/PR-7820 su più revisioni ROM.
- Gestione errori video codec/browser con diagnosi chiara.
- Save-state che includa CPU + stato player + timestamp video.

## P2
- Libreria di profili framefile Daphne importabili.
- Strumenti di timeline visuale e marker eventi/decisioni del gioco.

---

# Ordine di lavoro consigliato

Se l'obiettivo è aumentare rapidamente il numero di giochi realmente giocabili senza perdere stabilità:

1. Regression runner comune.
2. Garanzia single-file + debugger universale adapter-based **inlined** nei core.
3. SNES SRAM + timing DMA/HDMA.
4. Neo Geo raster/audio/blocchi Metal Slug.
5. GBA save hardware + DMA/audio.
6. Mapper NES e SMS/GG.
7. Timing VDP/PPU dei core intermedi.
8. Solo dopo: nuovi sistemi o coprocessori molto complessi.

La regola proposta è: **prima chiudere i buchi che rompono giochi già quasi funzionanti, poi aumentare l'ampiezza del progetto**.


## Launcher v0.1.8 — follow-up

### P0
- testare il protocollo di handoff su tutti i 12 core con almeno una ROM reale per sistema;
- aggiungere feedback “ROM caricata / errore core” più preciso invece del solo ACK di consegna;
- rendere la cache multipla per più cartelle recenti, mantenendo un limite di spazio.

### P1
- cache con invalidazione per singolo ZIP invece di invalidare tutta la cartella;
- mostrare tempo risparmiato dal cache hit e data dell’ultima scansione;
- ricordare l’ultimo gioco scelto per cartella/sistema.
