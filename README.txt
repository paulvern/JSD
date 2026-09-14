JSD EMULATOR HUB — pacchetto 7 sistemi
=====================================

Aprire: landing.html

HTML separati inclusi:
- gbjsd.html       — Game Boy
- colecojsd.html   — ColecoVision
- zx48jsd.html     — ZX Spectrum 48K
- msx1jsd.html     — MSX1
- intellijsd.html  — wrapper della versione Intellijsd live più recente disponibile nel progetto (M5.0 / source v22)

File di servizio:
- emulator-autoload.js

COME FUNZIONA
1. La landing legge una cartella (anche sottocartelle).
2. Riconosce il sistema usando estensioni, nomi, dimensioni e alcune firme binarie.
3. Identifica il BIOS adatto quando presente.
4. Se ci sono più giochi, permette di scegliere la ROM.
5. Apre l'HTML dell'emulatore in un iframe a tutta pagina.
6. ROM e BIOS sono trasferiti come oggetti File tramite postMessage.
7. Il bridge assegna i File agli input originali dell'emulatore e genera i normali eventi input/change.

RICONOSCIMENTO PRINCIPALE
- Game Boy: .gb/.gbc + logo Nintendo nell'header. Il GBJSD usato qui non richiede boot ROM.
- ColecoVision: .col/.cv, header cartuccia 55AA/AA55, BIOS Coleco da 8 KiB.
- ZX Spectrum 48K: .sna/.z80/.tap/.scr, ROM di sistema da 16 KiB.
- MSX1: .mx1 o ROM/cartucce con header AB, BIOS tipico da 32 KiB.
- Intellivision: .int/.itv/.rom/.bin, Executive ROM da 8 KiB e GROM da 2 KiB, soprattutto se i nomi contengono EXEC/EXECUTIVE e GROM/GRAPHICS.

NOTA INTELLIVISION
La Library conserva come versione più recente il progetto pubblicato Intellivision JS / Intellijsd M5.0 (source version 22), ma non espone il suo dist/index.html come file materializzabile. Per non sostituirlo con una versione precedente, intellijsd.html è un wrapper locale che apre esattamente la versione live più recente. La landing riconosce comunque Executive ROM, GROM e cartuccia e li conserva nel wrapper; il browser non consente però di iniettarli automaticamente nell'iframe remoto cross-origin. Gli altri quattro emulatori sono gli HTML standalone esatti recuperati dalla Library e hanno autoload locale completo.

PRIVACY
La landing non invia ROM o BIOS a server. L'unica eccezione di rete è la visualizzazione della versione Intellivision live nel suo wrapper; i File selezionati non vengono inviati alla pagina live dal wrapper.


AGGIORNAMENTO 6 SISTEMI
- Aggiunto Vectrex: vectrex_emulator.html (ultima versione verificata funzionante).
- La landing riconosce cartucce .vec e BIOS Vectrex da 8 KiB.
- Autoload Vectrex: BIOS -> #biosFile, cartuccia -> #romFile.
- intellijsd.html ora punta alla versione standalone pubblicata di Intellijsd M5.0.
  Nota: poiché la pagina pubblicata è su un dominio diverso, il browser non consente alla landing
  di impostarne direttamente gli input file. Per Intellivision la landing riconosce comunque
  EXEC/GROM/cartucce, ma il caricamento automatico completo richiede il file HTML standalone locale.


AGGIORNAMENTO ZIP SCAN + GAME BOY v3
- Intellivision: usa l'intellijsd.html fornito dall'utente.
- Game Boy: sostituito con gbjsd.html v3, versione più recente disponibile.
- La landing legge la directory centrale degli ZIP e riconosce le console dai file interni.
- Per ZIP DEFLATE (metodo 8) usa DecompressionStream('deflate-raw') del browser e crea File in memoria.
- BIOS e ROM trovati dentro ZIP partecipano al normale riconoscimento e autoload.
- Supportati per il riconoscimento interno: GB/GBC, COL/CV, VEC, SNA/Z80/TAP/SCR, MX1, INT/ITV, ROM/BIN e nomi BIOS noti.
- ZIP cifrati, ZIP64 o metodi di compressione insoliti possono essere riconosciuti solo parzialmente.


AGGIORNAMENTO CORRENTE
- Game Boy aggiornato alla versione GB/C/GBA più recente: supporta .gb, .gbc e .gba.
- Aggiunto SEGAJSD: Master System + Game Gear, con .sms/.gg e BIOS opzionale.
- ZIP scan aggiornato: riconosce ed estrae in memoria .gba, .sms e .gg oltre ai formati già supportati.
- GBA: oltre all'estensione .gba viene verificato l'header GBA (byte fisso 0x96).
- SEGA: oltre all'estensione .sms/.gg viene cercata la firma TMR SEGA nelle posizioni standard.
- Nota: l'attuale SEGAJSD è Master System + Game Gear; non contiene un core Mega Drive/Genesis.


BIOS SAFETY UPDATE
- Sega Master System / Game Gear: BIOS is optional and is NEVER autoloaded by the landing.
- Game Boy / Color / Advance: no BIOS is autoloaded.
- Required BIOSes for ColecoVision, ZX Spectrum 48K, MSX1, Vectrex and Intellivision
  are accepted only when system-specific filename rules AND exact expected size match.
- Generic .rom/.bin files are no longer promoted to BIOS merely because their size happens to match.


AGGIORNAMENTO UI / FULLSCREEN
- Rimosso “Selettore compatibile”; Scegli cartella usa automaticamente il fallback webkitdirectory quando necessario.
- Landing bilingue Italiano / English con preferenza salvata localmente.
- iframe emulatori: allowfullscreen + webkitallowfullscreen + fullscreen permission esplicita.
- Pulsante fullscreen del player nella barra della landing, come fallback centralizzato.
- Wrapper Intellivision aggiornato con permesso fullscreen esplicito sul sito embedded.


HELP / GUIDA
- Aggiunto help.html, accessibile dalla landing con "? Guida / ? Help".
- Guida bilingue Italiano/English.
- Descrive emulazione, reverse engineering, disassembly/decompilazione ricostruita,
  estrazione grafica e cattura audio.
- Include file supportati, BIOS, comandi e limitazioni di tutti i sistemi inclusi.


INTELLIVISION - CORREZIONE RICONOSCIMENTO
- Cartucce gioco riconosciute automaticamente: solo .int.
- EXEC: .bin/.rom, 8192 byte, nome contenente exec/executive.
- GROM: .bin/.rom, 2048 byte, nome contenente grom/graphics rom.
- I .bin/.rom generici non vengono più classificati come cartucce Intellivision.
- Nota: l'intellijsd.html presente in questa build è un wrapper verso la build deployata, non il core standalone completo.


INTELLIVISION STANDALONE UPDATE
- intellijsd.html sostituito con il core standalone M5.0 completo fornito dall'utente.
- Nessun iframe o sito deployato richiesto.
- Autoload: EXEC 8 KiB con nome EXEC/Executive -> #file-exec.
- Autoload: GROM 2 KiB con nome GROM/Graphics ROM -> #file-grom.
- Cartuccia dalla landing: esclusivamente .int -> #file-cart.
- I generici .bin/.rom non vengono classificati come giochi Intellivision dalla landing.
