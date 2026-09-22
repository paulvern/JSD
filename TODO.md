# JSD Emulator Hub — TODO

> English: [TODO_EN.md](TODO_EN.md)

Questo TODO sostituisce le liste storiche accumulate nelle release precedenti. Riporta solo attività ancora utili o verifiche che vale la pena mantenere.

## Priorità 0 — non rompere ciò che funziona

- [ ] Ogni modifica a un core deve avere un caso di regressione riproducibile.
- [ ] Evitare fix globali di timing, palette, banking o memoria se il problema è specifico di un gioco/board.
- [ ] Conservare gli HTML standalone: nessun core deve dipendere da `index.html`.
- [ ] Debugger/trace pesanti OFF di default e senza hook permanenti sul percorso CPU/memoria.
- [ ] Prima di sostituire un core nell'Hub, confrontare la revisione proposta con quella già inclusa e annotare eventuali regressioni note.

## Priorità 1 — test end-to-end dell'Hub

- [ ] Test browser reale dei 16 pulsanti “Apri emulatore” senza ROM.
- [ ] Test `jsd-probe → jsd-emulator-ready → jsd-launch → jsd-launch-accepted` sui 16 sistemi.
- [ ] Test caricamento automatico con ZIP, nested ZIP, BIOS multipli e set MAME.
- [ ] Verificare comportamento da `file://` su Chrome/Chromium, Firefox e Edge.
- [ ] Verificare che la cache analisi cartella venga invalidata quando cambia la tabella dei sistemi o il riconoscitore.

## Priorità 2 — salvataggi

- [x] Save Bridge per GB/GBC/GBA, SMS/GG, Mega Drive, Neo Geo, NES e PC Engine.
- [x] Backup JSON in grado di ricreare chiavi di salvataggio inesistenti.
- [x] NES: flush SRAM anche su `pagehide`/chiusura.
- [x] Neo Geo: mantenere compatibilità con `neogeojsd.mvs.backup.v137`.
- [ ] **SNES: implementare SRAM cartuccia reale**, mapping + persistenza + import/export.
- [ ] Aggiungere persistenza standardizzata ai core che in futuro implementeranno RAM batteria ma non hanno ancora il bridge.
- [ ] Aggiungere al Save Manager una verifica opzionale post-import: rilettura dello slot e confronto dimensione/hash.
- [ ] Testare export → cancellazione → import → rilettura su browser reale per tutti i sistemi collegati.
- [ ] Valutare export/import dei settori DOS IndexedDB in un formato portabile, senza confonderli con save-state.

## Priorità 3 — Neo Geo

Core corrente: `neogeojsd_v1425_dynamic_scb_trace`.

- [ ] Uniformare **solo in una futura revisione del core** le stringhe versione interne (nome file v1425, log/report v1.4.24, footer v1.4.6).
- [ ] Verificare Garou/GarouH: personaggi, SCB dinamici, C1-C8, palette e priorità.
- [ ] Verificare KOF '99, Metal Slug 3 e KOF 2000 sui profili NEO-SMA.
- [ ] Verificare Metal Slug X sulla finestra ALTERA `$2FFFE0-$2FFFEF`.
- [ ] Verificare Metal Slug 5 e KOF 2003 sul percorso NEO-PVC/CMC50/PCM2.
- [ ] Confrontare sprite zoom/SCB, catene short/tall e active-sprite buffers con riferimenti hardware/MAME/FBNeo senza sostituire il renderer funzionante in blocco.
- [ ] Migliorare audio YM2610 solo con test A/B su giochi noti; evitare regressioni su M1/Z80 command handoff.
- [ ] Aggiungere export strutturato audio: registri YM2610, command log Z80, eventualmente WAV/capture diagnostica.
- [ ] Mantenere backup RAM MVS e RTC indipendenti dai reset watchdog.

## Priorità 4 — SNES

- [ ] SRAM cartuccia persistente.
- [ ] OAM/OBJ extractor con PNG + JSON.
- [ ] Export CGRAM/palette.
- [ ] Export tilemap/background per Mode 0-7 quando ricostruibile.
- [ ] Risorse SPC700/S-DSP: BRR sample extraction, directory DSP e metadata ADSR/GAIN.
- [ ] Verificare timing e performance senza riattivare debugger continuo.
- [ ] Re-test titoli storicamente critici: Rampart, Dracula X, Art of Fighting, Mortal Kombat, Mario Kart.

## Priorità 5 — DOS

È il sistema più scoperto sul lato strumenti.

- [ ] Disassembler x86 16/32 bit statico, almeno 8086/286/386 reale/protected mode.
- [ ] Vista segment:offset + indirizzo lineare/fisico.
- [ ] Export testo/VGA text mode.
- [ ] Export framebuffer CGA/EGA/VGA e palette DAC.
- [ ] Cattura font VGA e plane data.
- [ ] Cattura Sound Blaster/OPL come log registri e WAV diagnostico.
- [ ] Export/import portabile delle modifiche HDD IndexedDB.
- [ ] Continuare test protected mode/IDT senza introdurre scorciatoie game-specific nel core CPU.

## Priorità 6 — CPS-1

- [ ] Trasformare il viewer grafico in un vero extractor: tile/sprite PNG, palette e metadata.
- [ ] Disassembler Z80 audio.
- [ ] Export registri CPS-A/CPS-B rilevanti per priorità/layer.
- [ ] Verificare sprite priority/layer sui titoli già quasi corretti senza cambiare il timing 30 FPS di default.
- [ ] Re-test Captain Commando, Cadillacs and Dinosaurs, Pang/Pang3, Varth e Street Fighter II.

## Priorità 7 — Mega Drive e System 16

### Mega Drive
- [ ] Disassembler Z80 audio.
- [ ] Export sprite VDP reale, non solo viewer.
- [ ] Export tilemap/plane A/B/window + CRAM/VSRAM.
- [ ] Migliorare YM2612/PSG senza impattare raster timing e DMA.

### System 16
- [ ] Disassembler Z80 audio.
- [ ] Export sprite e tilemap con attributi/priorità.
- [ ] Export/capture YM2151/uPD7759.
- [ ] Ampliare profili mapper solo con set verificati.

## Priorità 8 — PC Engine CD ALPHA 20

- [ ] Mantenere **CD ALPHA 20** come riferimento, non tornare a COMPAT V8/Alpha 19.
- [ ] Test HuCard e CD-ROM²/Super CD-ROM² nello stesso core.
- [ ] Verificare CUE + BIN/ISO/WAV, CD-DA e ADPCM.
- [ ] Export sprite dedicato oltre al viewer.
- [ ] Migliorare estrazione audio PSG/CD/ADPCM in formato diagnostico.
- [ ] Conservare BRAM/Backup RAM nel Save Bridge.

## Priorità 9 — NES

Core corrente: versione nested ZIP caricata in v0.2.7.

- [ ] Re-test mapper 0/1/2/3/4/7/66 con SRAM.
- [ ] Aggiungere mapper solo con test ROM mirati.
- [ ] DMC APU.
- [ ] Timing PPU più accurato per titoli sensibili a sprite-0/MMC3 IRQ.
- [ ] Migliorare raccolte ZIP senza caricare in memoria file inutili.
- [x] CHR PNG, OAM JSON, frame PNG e disassembler 6502/2A03 già presenti.

## Priorità 10 — C64

- [ ] Migliorare qualità SID e timing senza rompere TRUE 1541.
- [ ] Cattura SID strutturata: registri per frame/ciclo e WAV diagnostico.
- [ ] Re-test giochi con calcoli/timing problematici (es. punteggi, raster, loader multi-file).
- [ ] Ottimizzare 1541 mantenendo il percorso fisico completo per D64.

## Priorità 11 — GB/GBC/GBA

- [ ] Conservare la build GBA AUDIO AUTO FIX / UI FAST.
- [ ] Test audio GBA DMA/FIFO e sincronizzazione video/audio.
- [ ] Ridurre ogni costo residuo di debugger/trace nel percorso normale.
- [ ] Ampliare extractor GBA quando necessario senza modificare GB/GBC funzionanti.

## Priorità 12 — SMS/GG, Coleco, MSX, Spectrum, Intellivision, Vectrex

- [ ] SMS/GG: export sprite e audio strutturato.
- [ ] Coleco M1.4: mantenere sprite/audio extractor e verificare compatibilità input.
- [ ] MSX1: espandere mapper/cart solo con ROM di test.
- [ ] Spectrum: migliorare TAP/loader mantenendo target 48K.
- [ ] Intellivision: continuare miglioramenti controller senza cambiare CPU/STIC stabile.
- [ ] Vectrex: timing analogico/VIA/AY e compatibilità cart, preservando export SVG/WAV/AY JSON.

## Priorità 13 — documentazione e release

- [ ] Aggiornare README/TODO a ogni sostituzione canonica di core.
- [ ] Tenere una sola versione “canonica” per sistema nel pacchetto release.
- [ ] Registrare nel README il nome sorgente esatto quando le stringhe versione interne sono ambigue.
- [ ] `node --check` su tutti gli script inline prima di ogni ZIP.
- [ ] Controllare che non esistano `<script src>` obbligatori.
- [ ] Verificare 16/16 target del launcher.
- [ ] `unzip -t` sul pacchetto finale.
