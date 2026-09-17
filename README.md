# JSD Emulator Hub

JSD Emulator Hub è una raccolta di emulatori sperimentali **HTML/JavaScript eseguiti interamente nel browser**, accompagnati da strumenti di analisi, disassemblaggio, ispezione memoria ed estrazione di risorse.

L'obiettivo non è soltanto avviare i giochi: il progetto vuole essere anche un **laboratorio di reverse engineering per hardware e ROM retro**, mantenendo ogni macchina in un file HTML separato e leggibile.

## Build corrente

La build corrente integra **12 famiglie di sistemi** nel launcher:

| Sistema | File | CPU / hardware principale | Stato sintetico |
|---|---|---|---|
| Game Boy / Game Boy Color / Game Boy Advance | `gbjsd.html` | LR35902 / ARM7TDMI | GB/GBC maturi; GBA sperimentale |
| SEGA Master System / Game Gear | `segajsd.html` | Z80 / VDP / SN76489 | Funzionale, compatibilità buona |
| SEGA Mega Drive / Genesis | `megadrivejsd.html` | 68000 / Z80 / VDP / YM2612 | Alpha avanzata, raster timing |
| Neo Geo AES / MVS | `neogeojsd.html` | 68000 / Z80 / LSPC / YM2610 | Avanzato ma ancora sperimentale |
| Nintendo Entertainment System / Famicom | `nesjsd.html` | Ricoh 2A03 / PPU | Funzionale, mapper da ampliare |
| Super Nintendo / Super Famicom | `snesjsd.html` | 65C816 / PPU / SPC700 | Alpha 0.22c STABLE, sperimentale |
| PC Engine / TurboGrafx-16 | `pcejsd.html` | HuC6280 / HuC6270 / HuC6260 | HuCard funzionale, COMPAT V8 |
| ColecoVision | `colecojsd.html` | Z80 / TMS9918A / SN76489A | Funzionale, da rifinire |
| ZX Spectrum 48K | `zx48jsd.html` | Z80 / ULA | Funzionale per il target 48K |
| MSX1 | `msx1jsd.html` | Z80 / TMS9918A / AY-3-8910 | Funzionale, compatibilità da estendere |
| Intellivision | `intellijsd.html` | CP1610 / STIC / AY-3-8914 | Funzionale, strumenti RE avanzati |
| Vectrex | `vectrex_emulator.html` | MC6809 / VIA 6522 / AY-3-8912 | Core JavaScript originale, sperimentale |

È inoltre presente come laboratorio separato `laserdiscjsd_v1_0_daphne_timeline.html`, dedicato a **Dragon's Lair / Space Ace** con Z80 + player LaserDisc virtuale. Non è ancora conteggiato tra i 12 target del launcher principale.

## Filosofia del progetto

I principi attuali sono:

- **un emulatore = un HTML autonomo**, per evitare un monolite difficile da correggere;
- esecuzione locale nel browser, senza invio di ROM o BIOS a server;
- preferenza per core JavaScript originali e codice ispezionabile;
- nessuna ROM, BIOS o contenuto commerciale incluso;
- strumenti di analisi integrati quando utili: debugger, trace, disassembler, memoria, tile/sprite/vector/audio extraction;
- launcher comune come **selettore/riconoscitore**, senza dipendenze runtime imposte agli emulatori;
- ogni emulatore deve poter essere copiato e aperto da solo come singolo file `.html`;
- compatibilità incrementale basata su ROM reali testate, senza nascondere i limiti ancora presenti.

## Regola di autonomia dei core

Questa è una regola architetturale del progetto, non una preferenza grafica:

1. **Ogni emulatore distribuito deve essere un singolo HTML autosufficiente.**
2. Non deve richiedere `emulator-autoload.js`, `universal-debugger.js`, framework, CDN o altri file JavaScript locali per avviarsi.
3. Il launcher non deve dipendere da variabili interne dei core, usare `eval()` o rendere l’emulatore dipendente dall’Hub.
4. Ogni HTML può però esporre un **ricevitore opzionale JSD Hub** incorporato: se aperto dal launcher può ricevere ROM/BIOS via `postMessage`; se aperto da solo funziona normalmente e non richiede il launcher.
5. Codice comune di sviluppo è ammesso solo come **sorgente/build-time**: nella release finale viene incorporato nell'HTML che lo usa.
6. Un file emulator HTML copiato fuori dall'Hub deve mantenere caricamento ROM/BIOS, save, audio, video e strumenti che dichiara di supportare.

Nella build corrente il debugger universale, dove presente, è incorporato direttamente nell'HTML; non è una dipendenza runtime separata.

## Avvio

Aprire `index.html` in un browser moderno. `landing.html` è stato eliminato: esiste un solo entry point per evitare divergenze tra due launcher.

Per un uso stabile dei salvataggi si consiglia di servire la cartella tramite HTTP/HTTPS, per esempio con un piccolo server statico locale o GitHub Pages. `localStorage` è associato all'origine del sito; con URL `file://` il comportamento può variare tra browser.

Il launcher può ricevere una cartella contenente:

- ROM;
- BIOS richiesti dal sistema;
- ZIP;
- savegame compatibili;
- sottocartelle.

Analizza i file localmente e prova a riconoscere il sistema. Quando si seleziona un gioco e si preme **Apri gioco**, `index.html` apre l’HTML corrispondente in una nuova scheda e trasferisce **solo la ROM selezionata e gli eventuali BIOS richiesti** tramite `postMessage`/`ArrayBuffer`. Il ricevitore è incorporato nel singolo HTML e resta completamente opzionale: l’emulatore continua a funzionare anche aperto direttamente.

## Riconoscimento nel launcher

Il riconoscimento usa una combinazione di:

- estensione;
- dimensione;
- firme/header noti;
- nome del file o della cartella;
- presenza congiunta di BIOS o componenti di un ROM set.

Esempi:

- Nintendo logo per GB/GBC;
- header GBA;
- `TMR SEGA` per SMS/GG;
- header `SEGA` per Mega Drive;
- firma iNES per NES;
- `.sfc` / `.smc` per SNES;
- struttura P/S/M/V/C per Neo Geo;
- BIOS Executive + GROM per Intellivision;
- BIOS Vectrex da 8 KiB + cartuccia `.vec`.

Il riconoscimento automatico può sempre essere corretto manualmente dal menu **Sistema**.

## ZIP e archivi

Il launcher e molti core leggono ZIP direttamente con API native del browser, senza decompressione lato server.

Sono supportati soprattutto:

- ZIP Store;
- ZIP Deflate quando `DecompressionStream('deflate-raw')` è disponibile.

Limitazioni tipiche:

- ZIP cifrati non supportati;
- ZIP64 non gestiti in tutti i percorsi;
- metodi di compressione poco comuni non supportati.

### SNES e 7z

La build SNES integrata è `SNESJSD alpha 0.22c STABLE`. La versione originale allegata poteva scaricare `7z-wasm` da CDN al primo uso di un `.7z`.

Nella build Hub la parte 7z remota è stata rimossa: **SNES usa `.sfc`, `.smc` e `.zip`**, così il pacchetto resta utilizzabile offline e non introduce una dipendenza runtime esterna.

## Salvataggi

Il launcher dispone di **I miei salvataggi**, che legge i save persistenti presenti in `localStorage`.

Attualmente la gestione Hub è normalizzata soprattutto per:

- Game Boy / GBC / GBA;
- NES;
- PC Engine;
- Mega Drive / Genesis.

Per questi sistemi, dove il core lo consente, i dati batterizzati possono essere:

- ripristinati automaticamente dal browser;
- salvati automaticamente;
- scaricati sul PC;
- reimportati dal PC;
- esportati insieme tramite backup JSON del launcher.

### Savegame e save-state non sono la stessa cosa

**Savegame persistente**: SRAM, Backup RAM, Flash o memoria equivalente prevista dalla macchina/cart.

**Save-state**: fotografia completa dello stato dell'emulatore, molto più dipendente dalla versione del core.

I due formati restano separati per evitare che un aggiornamento dell'emulatore renda inaffidabile l'archivio dei progressi normali.

Vectrex non dispone di una SRAM batterizzata standard paragonabile a Mega Drive o SNES: eventuali salvataggi completi vanno quindi trattati come save-state.

La SRAM SNES non è ancora integrata nella gestione persistente dell'Hub: è una priorità P0 del TODO.

## Reverse engineering

A seconda della piattaforma sono disponibili o in sviluppo:

- disassembly CPU;
- trace delle istruzioni;
- registri CPU e periferiche;
- memory dump;
- breakpoint/debugger;
- tile viewer;
- sprite/OAM viewer;
- palette viewer;
- estrazione PNG;
- cattura vettori SVG/JSON;
- cattura registri audio;
- ricostruzione WAV;
- esportazione ASM o JSON diagnostico.

### Cosa non significa “decompilare”

Una ROM commerciale contiene codice macchina e dati, non il progetto originale. Il disassembler può ricostruire istruzioni, label sintetiche e flusso di controllo, ma normalmente non può recuperare:

- nomi originali di variabili/funzioni;
- commenti;
- macro e include originali;
- sorgenti C/C++ originali;
- struttura del repository dello sviluppatore;
- file sorgente degli strumenti grafici/audio.

## Dipendenze e funzionamento offline

L'obiettivo della build Hub è non richiedere CDN o librerie remote per emulare.

- Vectrex usa ora il **core JavaScript originale del progetto**, senza VecX/WebAssembly di terze parti.
- SNES non usa più il caricamento remoto di `7z-wasm` nella build Hub.
- ZIP usa API native del browser.
- Canvas 2D, Web Audio, WebAssembly eventualmente presente nei singoli esperimenti e `localStorage` sono API del browser, non CDN.

Per la situazione dettagliata vedere `DEPENDENCIES.md`.

## Stato per piattaforma

### Game Boy / Game Boy Color / Game Boy Advance

`gbjsd.html`

Punti forti:

- GB/GBC con buon livello di compatibilità;
- GBA nello stesso laboratorio ma con core separato;
- tile, OBJ/OAM, palette e disassembly;
- salvataggi persistenti gestibili dal launcher.

Limiti principali:

- GBA non è cycle-perfect;
- audio GBA e DirectSound ancora incompleti;
- periferiche cartuccia e casi EEPROM/Flash particolari da ampliare.

### Master System / Game Gear

`segajsd.html`

Punti forti:

- core Z80/VDP condiviso;
- CRT/fullscreen;
- ZIP;
- strumenti grafici e disassembler.

Limiti principali:

- timing VDP e casi raster ancora migliorabili;
- mapper meno comuni da verificare;
- persistenza save da uniformare con il Save Manager centrale.

### Mega Drive / Genesis

`megadrivejsd.html`

Build corrente: **MDJSD alpha 1.1 Raster Timing**.

Punti forti:

- Motorola 68000 + Z80;
- VDP e timing raster più avanzato;
- SRAM persistente;
- import/export `.srm`.

Limiti principali:

- accuratezza VDP/raster/DMA ancora da validare su più titoli;
- audio YM2612/PSG da rendere più fedele;
- chip cartuccia speciali non sono l'obiettivo corrente.

### Neo Geo AES / MVS

`neogeojsd.html`

Build corrente: **v1.2.5**.

Punti forti:

- 68000 + Z80;
- ROM set P/S/M/V/C;
- LSPC;
- supporto BIOS/UniBIOS;
- strumenti per P-ROM, FIX, sprite e audio.

Limiti principali osservati durante lo sviluppo:

- raster effects e ombre non perfetti in alcuni titoli;
- alcuni giochi richiedono ulteriore accuratezza nel rendering sprite;
- Metal Slug 2 e altri titoli complessi hanno mostrato blocchi dopo il boot;
- YM2610/audio è ancora uno dei sottosistemi da migliorare.

### NES / Famicom

`nesjsd.html`

Punti forti:

- core 2A03/PPU;
- supporto iNES;
- SRAM/PRG-RAM persistente;
- import/export `.sav`.

Limiti principali:

- compatibilità fortemente legata ai mapper;
- IRQ mapper, mirroring e casi PPU sensibili al timing devono essere testati sistematicamente.

### SNES / Super Famicom

`snesjsd.html`

Build corrente: **SNESJSD alpha 0.22c STABLE**.

Implementa un core sperimentale 65C816 + PPU, SPC700/S-DSP e parti di chip speciali, incluso Super FX. Supporta Modes 0–7, HDMA e strumenti di debug/grafica.

Limiti principali:

- timing PPU/DMA/HDMA non ancora completamente cycle-accurate;
- Super FX è sperimentale;
- DSP e altri coprocessori necessitano più copertura;
- SRAM batterizzata non è ancora collegata al Save Manager;
- SA-1, S-DD1 e altri chip speciali non sono completi;
- audio SPC700/S-DSP richiede ulteriore accuratezza.

La build Hub accetta `.sfc`, `.smc` e `.zip`; il supporto remoto 7z è stato eliminato.

### PC Engine / TurboGrafx-16

`pcejsd.html`

Build corrente: **PCEJSD COMPAT V8**.

Punti forti:

- HuC6280;
- HuCard standard;
- VDC/VCE;
- sprite collision e priorità progressivamente migliorate;
- Backup RAM persistente;
- import/export save.

Limiti principali:

- CD-ROM² non incluso;
- Arcade Card non inclusa;
- SuperGrafx non completo;
- PSG e timing non completamente cycle-perfect.

### ColecoVision

`colecojsd.html`

Punti forti:

- Z80 + TMS9918A + SN76489A;
- BIOS + cartuccia;
- strumenti per sprite, VRAM, audio e disassembly.

Limiti principali:

- compatibilità da ampliare su titoli problematici;
- timing VDP e input da sottoporre a suite di regressione.

### ZX Spectrum 48K

`zx48jsd.html`

Target volutamente concentrato sul 48K.

Punti forti:

- Z80/ULA;
- snapshot e formati tipici del 48K;
- CRT;
- trace/disassembly;
- screen/audio capture.

Limiti principali:

- non è ancora un emulatore unificato 48/128/+2/+3;
- caricamento nastro e timing border/beeper possono essere ulteriormente raffinati.

### MSX1

`msx1jsd.html`

Punti forti:

- Z80;
- TMS9918A;
- AY;
- BIOS + cartuccia;
- strumenti grafici e disassembly.

Limiti principali:

- mapper cartuccia e periferiche non universali;
- espansioni e MSX2 sono fuori dal core corrente;
- timing VDP/audio da validare più sistematicamente.

### Intellivision

`intellijsd.html`

Punti forti:

- CP1610;
- STIC;
- Executive ROM + GROM;
- estrazione grafica/audio;
- disassembler e analisi codice/dati.

Limiti principali:

- accuratezza controller/keypad da consolidare;
- casi STIC e timing meno comuni da testare su una libreria più ampia.

### Vectrex

`vectrex_emulator.html`

La build corrente usa il **core JavaScript originale JSD**, non il precedente core VecX compilato in WebAssembly.

Punti forti:

- MC6809;
- VIA 6522;
- AY-3-8912;
- display vettoriale;
- disassembler 6809;
- esportazione forme SVG/JSON;
- esportazione audio/registri;
- nessuna libreria runtime esterna.

Limiti principali:

- core ancora sperimentale;
- VIA, analog integrators e timing vettoriale devono essere verificati su più ROM;
- accuratezza audio e comportamento dei titoli più sensibili resta da migliorare.

## LaserDiscJSD — laboratorio separato

`laserdiscjsd_v1_0_daphne_timeline.html`

Prototipo standalone per Dragon's Lair / Space Ace. Il file implementa Z80, scheda Cinematronics e player LaserDisc virtuale con mapping della timeline MP4/Daphne. Il video resta locale nel browser.

Non viene ancora avviato automaticamente dall'Hub perché il suo input è diverso dagli altri sistemi: richiede **ROM + file video**, e il launcher deve imparare a trattare il video come media associato e non come ROM/BIOS.

## Universal Debugger

Il debugger universale può essere riutilizzato come sorgente comune, ma nella release deve essere **inlined nel singolo HTML**. L’obiettivo è mantenere breakpoint/watchpoint/memory dump/trace coerenti senza creare una dipendenza runtime condivisa.

Il TODO generale descrive come farlo senza rallentare gli emulatori durante il normale Run.

## Struttura del progetto

```text
JSD Emulator Hub/
├── index.html                  launcher / unico entry point
├── help.html                   guida UI
├── savegame-manager.html       Save Bank manuale
├── README.md
├── TODO.md
├── DEPENDENCIES.md
├── gbjsd.html
├── segajsd.html
├── megadrivejsd.html
├── neogeojsd.html
├── nesjsd.html
├── snesjsd.html
├── pcejsd.html
├── colecojsd.html
├── zx48jsd.html
├── msx1jsd.html
├── intellijsd.html
├── vectrex_emulator.html
└── laserdiscjsd_v1_0_daphne_timeline.html   laboratorio standalone
```

Il laboratorio LaserDisc può essere distribuito accanto all'Hub, ma per ora resta separato dal conteggio dei target launcher.

## Roadmap

La roadmap dettagliata e motivata è in [`TODO.md`](TODO.md).

Priorità trasversali immediate:

1. **P0 — regressione automatica** su un set di ROM note per ogni core;
2. **P0 — debugger universale inlined per core**, con adapter coerenti ma nessuna dipendenza runtime esterna;
3. **P0 — SRAM SNES** con `localStorage` + download/upload;
4. **P0 — sistemazione dei casi di blocco Neo Geo e timing SNES**;
5. **P1 — unificazione Save Manager / save-state / metadati ROM**;
6. **P1 — libreria/riconoscimento nel launcher** con handoff opzionale ROM/BIOS, senza rendere i core dipendenti dall’Hub;
7. **P1 — performance profiling comune** per CPU/PPU/VDP/audio;
8. **P2 — call graph, ROM map, live patching e workspace `.jsd`**.

## Compatibilità e contributi

Il progetto è sperimentale. Un gioco che “parte” non implica necessariamente:

- timing corretto;
- audio corretto;
- collisioni corrette;
- raster effect corretti;
- supporto completo di mapper/coprocessori;
- assenza di blocchi più avanti nel gioco.

Per una regressione utile, quando si segnala un problema conviene indicare:

- sistema;
- nome ROM;
- regione/revisione se nota;
- punto esatto del blocco;
- ultimo PC/opcode o messaggio del debugger;
- screenshot del rendering errato;
- se il problema compare con audio/debugger attivi o disattivi.

## Note legali

Nessuna ROM o BIOS commerciale è incluso nel progetto.

Usare ROM, BIOS e media ottenuti legalmente. Marchi e nomi delle piattaforme appartengono ai rispettivi proprietari.

## Riconoscimento ROM del launcher

`index.html` usa firme/header, estensioni, struttura degli ZIP e contesto BIOS+cartuccia; i dettagli sono in `ROM_DETECTION.md`. Il pannello **Diagnostica riconoscimento** mostra punteggi e motivazioni e le sue righe possono anche forzare manualmente il sistema quando il rilevamento è ambiguo. I raw `.bin/.rom` privi di firma universale restano volutamente trattati con cautela e possono essere associati manualmente.


## v0.1.8 — launcher minimale, handoff e cache cartella

- `landing.html` rimosso: resta solo `index.html`.
- La colonna di riconoscimento mostra solo sistema rilevato e diagnostica.
- La selezione del gioco e i pulsanti di avvio/refresh sono nella sezione cartella.
- **Apri gioco** apre l’emulatore in una nuova scheda e consegna ROM/BIOS con un protocollo `postMessage` incorporato nei singoli HTML.
- Ogni emulatore resta standalone: il ricevitore non è necessario per l’uso diretto.
- L’analisi della cartella viene salvata in `localStorage` come manifest/metadati, mai come copia delle ROM.
- Se si riseleziona la stessa cartella con stesso elenco, dimensioni e `lastModified`, l’analisi viene ricostruita dalla cache.
- **Refresh analisi** forza una nuova scansione e aggiorna la cache.
- Le ROM contenute in ZIP annidati vengono materializzate soltanto quando il gioco viene lanciato.
