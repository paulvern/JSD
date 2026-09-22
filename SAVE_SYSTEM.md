# Sistema salvataggi / Save system — v0.2.7

## Persistenza verificata nel codice

| Sistema | Persistenza | Quando salva | Hub Save Manager |
|---|---|---|---|
| GB/GBC | RAM batteria + RTC | periodico, power-off, unload | sì |
| GBA | SRAM/Flash/EEPROM del core | power-off/shutdown/unload | sì |
| SMS/Game Gear | SRAM cartuccia (add-on Hub esterno al core) | cambio ROM, pagina nascosta, pagehide/unload | sì |
| Mega Drive | SRAM dichiarata dall’header | ogni 60 frame se dirty + unload/import | sì |
| Neo Geo MVS | backup RAM 64 KiB | dirty ogni 60 frame, power/watchdog/unload | sì |
| NES | PRG RAM/SRAM 8 KiB | ogni 120 frame se dirty + power-off/unload | sì |
| PC Engine / CD-ROM² | Backup RAM 2 KiB | ogni 120 frame se dirty + power-off/unload | sì |
| DOS | settori HDD modificati | salvataggio profilo esplicito in IndexedDB | no, gestito da DOSJSD |

## Save-state/manuali

ColecoVision, ZX Spectrum, MSX1 e diversi altri core hanno export/import di stato o file locali, ma non sono inclusi nel backup persistente centrale. Intellivision e Vectrex non richiedono normalmente una RAM cartuccia batterizzata nel core attuale. CPS-1 e System 16 sono arcade e non usano il modello SRAM cartuccia dell’Hub.

## Limitazione nota

Il core SNES attuale legge il campo `sramExp` dell’header, ma non implementa ancora il mapping/persistenza della SRAM cartuccia. È quindi esplicitamente marcato nel TODO anziché essere presentato come supportato.

## Hub v0.2.7

Il Save Manager non legge più soltanto il `localStorage` del launcher. Per i sei core persistenti crea iframe locali temporanei, interroga il relativo storage con `postMessage`, quindi distrugge gli iframe. Il backup JSON `jsd-local-saves-2` può ricreare una chiave anche su un browser/installazione senza slot preesistente.

---

## English

Persistent cartridge/machine saves are directly bridged for GB/GBC/GBA, SMS/GG, Mega Drive, Neo Geo MVS, NES and PC Engine/CD-ROM². DOS keeps changed HDD-sector profiles in its own IndexedDB. The current SNES core only parses SRAM-size metadata and still lacks cartridge SRAM mapping/persistence; this is intentionally documented as a limitation.
