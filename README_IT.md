# JSD Emulator Hub — README

> English: [README_EN.md](README_EN.md)

JSD Emulator Hub raccoglie emulatori sperimentali **HTML + JavaScript eseguiti nel browser**. Ogni emulatore resta utilizzabile anche come file HTML autonomo: il launcher aggiunge riconoscimento ROM, avvio assistito e gestione centralizzata dei salvataggi, ma non è necessario per aprire i core.

## Build corrente

**v0.2.9 — Core refresh + Neo Geo Dynamic SCB + NES nested ZIP + Save Bridge.**

La release espone **16 sistemi nel launcher**. È incluso anche un laboratorio LaserDisc standalone, non contato fra i 16 sistemi.

### Core inclusi

| # | Sistema | File Hub | Revisione / sorgente canonica |
|---:|---|---|---|
| 1 | Game Boy / Game Boy Color / Game Boy Advance | `gbjsd.html` | `gbjsd_gba_audio_auto_fixed.html` |
| 2 | Master System / Game Gear | `segajsd.html` | core Z80 + VDP Mode 4 + SN76489 |
| 3 | Mega Drive / Genesis | `megadrivejsd.html` | MDJSD alpha 1.1 Raster Timing |
| 4 | Neo Geo AES/MVS | `neogeojsd.html` | `neogeojsd_v1425_dynamic_scb_trace.html` |
| 5 | NES / Famicom | `nesjsd.html` | `nesjsd_nested_zip(2).html` |
| 6 | SNES / Super Famicom | `snesjsd.html` | `snesjsd_alpha22c_STABLE.html` |
| 7 | PC Engine / TurboGrafx-16 / CD-ROM² | `pcejsd.html` | `pcejsd_cdrom_alpha20.html` |
| 8 | ColecoVision | `colecojsd.html` | Colecojsd M1.4 |
| 9 | ZX Spectrum 48K | `zx48jsd.html` | core 48K |
| 10 | MSX1 | `msx1jsd.html` | M1.0 |
| 11 | Intellivision | `intellijsd.html` | CP1610 + STIC standalone |
| 12 | Vectrex | `vectrex_emulator.html` | MC6809 + VIA + AY standalone |
| 13 | Capcom CPS-1 | `cps1jsd.html` | `cpsjsd_cps1_alpha28_video_sync_priority.html` |
| 14 | Commodore 64 | `c64jsd.html` | `c64jsd_alpha65_rotational_layout (1).html` |
| 15 | DOS / IBM PC | `dosjsd.html` | alpha 1.24 PM16 IDT VERIFIED |
| 16 | SEGA System 16 / Arcade | `system16jsd.html` | `Sega_Arcade_JSD_unified_alpha17_system16_audio.html` |

`laserdiscjsd_v1_0_daphne_timeline.html` resta un laboratorio separato.

## File aggiornati nella v0.2.9

Questa build ricostruisce esplicitamente dall'ultimo file sorgente disponibile:

- GB/GBC/GBA;
- NES;
- SNES;
- PC Engine/CD-ROM²;
- CPS-1;
- Commodore 64;
- SEGA System 16/Arcade.

Neo Geo resta sulla revisione `neogeojsd_v1425_dynamic_scb_trace.html` scelta come versione canonica nella build precedente.

Le integrazioni Hub vengono aggiunte **fuori dal core** quando possibile: handoff del launcher, Save Bridge e flush dei salvataggi. Nel caso GB/GBA il bridge già presente nel file sorgente viene sostituito dalla variante Hub corretta, mentre i due script di emulazione restano identici al sorgente.

## Neo Geo

Il file canonico è `neogeojsd_v1425_dynamic_scb_trace.html`. Le stringhe interne non sono uniformi: alcune parti riportano `v1.4.24`, mentre il footer riporta `v1.4.6`. L'Hub non le riscrive e identifica la revisione con il nome del file caricato.

Questa linea comprende:

- banking standard Neo Geo;
- NEO-SMA per KOF '99, Garou/GarouH, Metal Slug 3 e KOF 2000;
- protezione Metal Slug X;
- NEO-PVC per Metal Slug 5 e KOF 2003;
- percorsi CMC42/CMC50 e NEO-PCM2;
- LSPC/raster e palette banking evoluti;
- diagnostica sprite/SCB dinamica e C-ROM;
- Z80 + YM2610/WebAudio;
- RTC uPD4990A;
- backup RAM MVS persistente da 64 KiB.

## Launcher

Aprire `index.html`.

La griglia usa la stessa tabella `SYSTEMS` del riconoscimento e mostra **tutti e 16 i sistemi**. Ogni card può aprire il relativo emulatore anche senza scegliere una ROM.

Il launcher può analizzare cartelle e archivi usando estensione, firma, dimensione, struttura ZIP, nomi MAME e combinazioni BIOS/cart.

Protocollo di avvio assistito:

`jsd-probe → jsd-emulator-ready → jsd-launch → jsd-launch-accepted`

Il protocollo viene ignorato quando l'emulatore è aperto direttamente.

## ROM, ZIP e archivi

Il supporto dipende dal core:

- **NES:** `.nes`, ZIP con una ROM e raccolte ZIP/nested ZIP;
- **SNES:** `.sfc`, `.smc`, ZIP/nested ZIP; il file sorgente include anche supporto 7Z opzionale tramite `7z-wasm`, caricato dalla rete solo quando si apre un `.7z`;
- **PC Engine:** HuCard e CD-ROM²/Super CD-ROM² con ZIP oppure CUE + BIN/ISO/WAV;
- **Neo Geo / CPS-1 / System 16:** set MAME e classificazione dei chip;
- **C64:** PRG, D64, T64, TAP, CRT e ZIP;
- **DOS:** IMG/IMA/HDD/DSK e pacchetti contenenti EXE/COM/BAT.

Non esiste una dipendenza JavaScript remota obbligatoria per avviare l'Hub o i core. Il solo caso opzionale attualmente documentato è l'apertura 7Z nel core SNES sorgente.

Il launcher conserva nel proprio indice **solo metadati**, non copie persistenti delle ROM.

## Salvataggi

### Save persistenti

Il Save Manager centrale usa iframe temporanei e `postMessage` per interrogare direttamente i core. Non assume che pagine HTML separate aperte via `file://` condividano sempre lo stesso `localStorage`.

| Sistema | Persistenza attuale |
|---|---|
| GB/GBC | RAM batteria + RTC |
| GBA | buffer save SRAM/Flash/EEPROM riconosciuto dal core; i casi EEPROM/seriali più particolari restano da validare |
| SMS/GG | SRAM persistente aggiunta dal layer Hub |
| Mega Drive | SRAM cartuccia |
| Neo Geo MVS | backup RAM 64 KiB |
| NES | PRG RAM/SRAM |
| PC Engine / CD | Backup RAM / BRAM |
| DOS | settori HDD modificati tramite IndexedDB interno |

**SNES:** il core corrente legge i dati SRAM dall'header, ma mapping e persistenza della SRAM cartuccia non sono ancora implementati completamente.

### Neo Geo

La chiave di backup MVS rimane:

`neogeojsd.mvs.backup.v137`

I salvataggi creati con la precedente build Neo Geo dell'Hub restano quindi compatibili.

### Save-state

I save-state completi sono specifici del singolo emulatore e della relativa revisione. Non vengono considerati intercambiabili tra core o versioni diverse.

## Debugger e prestazioni

La regola della suite è che trace e debugger pesanti devono essere **spenti per il gioco normale**.

- NES: CPU trace disattivato di default;
- SNES alpha 0.22c: modalità prestazioni attiva di default; trace CPU non selezionato;
- Neo Geo: trace configurabile e modalità prestazioni disponibili;
- CPS-1/C64/System 16: strumenti diagnostici restano separati dal percorso normale di esecuzione per quanto possibile.

Non va aggiunto polling per-frame dal launcher ai core in esecuzione.

## Disassembler ed estrazione risorse

| Sistema | Disassembler | Estrazione / ispezione risorse |
|---|---|---|
| GB/GBC/GBA | ✅ LR35902 + ARM/Thumb | ✅ tile, OBJ/OAM, VRAM, frame, JSON |
| SMS/GG | ✅ Z80 | ◐ tile/VRAM/CRAM; export sprite/audio incompleto |
| Mega Drive | ◐ 68000; Z80 audio da completare | ◐ tile/palette/sprite viewer |
| Neo Geo | ✅ 68000 + Z80 | ◐ FIX/C-ROM PNG + P-ROM CPU view; export audio incompleto |
| NES | ✅ 6502/2A03 | ✅ CHR PNG, OAM JSON, frame PNG, dump memoria |
| SNES | ✅ 65C816 | ◐ tile/VRAM; OAM/CGRAM/BRR da completare |
| PC Engine | ✅ HuC6280 | ◐ tile/BAT/VRAM/palette; sprite/audio export da completare |
| ColecoVision | ✅ Z80 | ✅ sprite + audio |
| ZX Spectrum | ✅ Z80 | ✅ screen/crop + beeper |
| MSX1 | ✅ Z80 | ✅ sprite + audio |
| Intellivision | ✅ CP1610 | ✅ sprite/card + sound |
| Vectrex | ✅ 6809 | ✅ SVG/vector JSON + WAV/AY JSON |
| C64 | ✅ 6510 | ◐ grafica; export SID strutturato da completare |
| DOS | ❌ | ❌ |
| CPS-1 | ◐ 68000; Z80 audio da completare | 👁 viewer grafico, export completo da aggiungere |
| System 16 | ◐ 68000; Z80 audio da completare | ◐ tile/sprite viewer, export sprite/audio da completare |

## Note sui core arcade SEGA

`system16jsd.html` deriva dal core unificato **Sega Arcade JSD alpha 0.17**. Oltre al percorso System 16B, il file contiene logica unificata per System C/C2 e Mega-Tech/Mega Play. Nel launcher viene comunque esposto come voce arcade/System 16 separata dal Mega Drive standalone, per non sostituire il core console che già funziona.

## Principi del progetto

1. Ogni core deve restare utilizzabile standalone.
2. Nessuna ROM o BIOS commerciale viene distribuito nel pacchetto.
3. Il launcher non deve cambiare CPU/video/audio di un core che funziona.
4. Le funzioni comuni dell'Hub vanno aggiunte come layer esterni quando possibile.
5. Debugger e trace costosi restano spenti di default.
6. I fix di compatibilità devono essere localizzati ed evitare regressioni nei giochi già funzionanti.

## Documentazione

- `README.md` / `README_IT.md` — guida italiana
- `README_EN.md` — English README
- `TODO.md` / `TODO_IT.md` — piano di lavoro italiano
- `TODO_EN.md` — English TODO
- `SAVE_SYSTEM.md` — architettura del Save Bridge
- `SAVE_TEST_REPORT.md` — rapporto di verifica salvataggi
- `ROM_DETECTION.md` — regole di riconoscimento ROM
- `STANDALONE.md` — regole per i core standalone
- `DEBUGGER_NOTES.md` — debugger e prestazioni
- `DEPENDENCIES.md` — dipendenze e API runtime
- `CORE_SOURCE_HASHES.json` — SHA-256 dei file sorgente usati nel refresh v0.2.9

## Stato

I core sono sperimentali. “Integrato” non significa compatibilità completa con tutto il catalogo commerciale: la priorità è preservare ciò che già funziona e correggere casi riproducibili senza introdurre regressioni globali.
