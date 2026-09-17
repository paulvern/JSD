# Runtime dependencies

La build JSD Emulator Hub è pensata per funzionare offline dopo il download.

## Dipendenze di rete

**Nessuna dipendenza runtime di rete è richiesta dalla build Hub corrente.**

Non sono necessari:

- CDN JavaScript;
- CSS remoti;
- moduli ES remoti;
- API server per ROM/save;
- servizi cloud.


## Dipendenze locali tra emulatori

**Nessuna.** Ogni emulatore della release deve funzionare come singolo file HTML copiato fuori dall'Hub.

In particolare non sono richiesti a runtime:

- `emulator-autoload.js`;
- `universal-debugger.js`;
- file JavaScript condivisi del launcher.

Quando codice comune viene riutilizzato nello sviluppo, viene incorporato nel relativo HTML prima della distribuzione. Il launcher apre soltanto il file HTML scelto e non inietta ROM, BIOS o save nel core.

## API del browser usate

I singoli emulatori possono usare:

- Canvas 2D;
- Web Audio;
- `localStorage`;
- File / Blob / Object URL;
- `DecompressionStream` per ZIP Deflate;
- Fullscreen API;
- WebAssembly solo in esperimenti che lo includano esplicitamente nel file, ma il Vectrex corrente dell'Hub è JavaScript puro.

## Vectrex

`vectrex_emulator.html` usa il core JavaScript originale del progetto e non carica VecX o altre librerie esterne.

## SNES

Il file SNES originale allegato includeva supporto opzionale `.7z` mediante download di `7z-wasm` da CDN. Nella build Hub questa parte è stata rimossa.

La build Hub SNES supporta:

- `.sfc`;
- `.smc`;
- `.zip`.

## Link documentali

Eventuali URL presenti nei testi/crediti/documentazione non costituiscono una dipendenza runtime finché non vengono caricati come script, stylesheet, modulo o fetch necessario all'emulazione.

## Launcher handoff v0.1.8

`index.html` usa solo API native del browser (`window.open`, `postMessage`, `ArrayBuffer`, `File`, `DataTransfer`, `localStorage`) per aprire una nuova scheda e consegnare ROM/BIOS al ricevitore opzionale incorporato nei singoli emulatori. Non introduce librerie esterne o dipendenze di rete.

La cache della cartella memorizza solo metadati/manifest dell'analisi in `localStorage`; i byte delle ROM non vengono salvati lì.
