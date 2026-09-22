# Verifica salvataggi — JSD Hub v0.2.7

Data build: 2026-09-21

## Test eseguiti

- Bridge salvataggi: test unitario in JavaScript con storage simulato per **GB/GBC/GBA, SMS/GG, Mega Drive, Neo Geo, NES, PC Engine**.
- NES v0.2.7: test dedicato del bridge `probe -> write -> delete` superato con chiavi legacy `nesjsd_sram_<titolo>`.
- Per ciascun sistema: `probe -> elenco`, `write -> ripristino/creazione chiave`, `delete -> rimozione`.
- SMS/GG: test separato dell'add-on SRAM con ripristino all'apertura ROM e persistenza a `pagehide`.
- Controllo statico dei percorsi nativi di persistenza:
  - GB/GBC: batteria + RTC;
  - GBA: save hardware esportato/importato dal core;
  - Mega Drive: SRAM;
  - NES: PRG RAM/SRAM; il core aggiornato usa `nesjsd_sram_<titolo>` e l’Hub forza il flush anche su `pagehide`/pagina nascosta;
  - PC Engine/CD: Backup RAM;
  - Neo Geo MVS: 64 KiB backup RAM.
- Import backup completo Hub: non richiede più una chiave preesistente; formato corrente `jsd-local-saves-2`.
- Tutti gli script inline della build: `node --check` senza errori.
- 16 destinazioni del launcher presenti.
- Nessun `<script src>` esterno obbligatorio.
- Neo Geo v1.4.0, Coleco M1.4, PCE CD Alpha 20 e NES nested-ZIP aggiornato: script principale identico alla sorgente canonica; bridge Hub aggiunti fuori dal core.

## Limitazioni note

- SNES: il core corrente legge il metadato `sramExp`, ma non implementa ancora mapping/persistenza della SRAM cartuccia.
- DOS: i settori HDD modificati/configurazione sono persistiti dal core in IndexedDB e non fanno parte del backup centrale del launcher.
- I save-state completi restano specifici del singolo emulatore e non vengono inclusi nel backup persistente dell'Hub.
- Il test end-to-end con Chromium headless non è disponibile in questo ambiente: Chromium non completa il bootstrap per limiti del runtime (DBus/zygote). Non viene quindi dichiarato come test superato.
