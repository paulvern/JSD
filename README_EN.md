# JSD Emulator Hub — README

> Italiano: [README_IT.md](README_IT.md)

JSD Emulator Hub is a collection of experimental **HTML + JavaScript emulators running in the browser**. Every emulator remains usable as a standalone HTML file: the launcher adds ROM detection, assisted launching and central save management, but it is not required to open a core.

## Current build

**v0.2.9 — Core refresh + Neo Geo Dynamic SCB + NES nested ZIP + Save Bridge.**

The release exposes **16 systems in the launcher**. A standalone LaserDisc laboratory is also included but is not counted among the 16 systems.

### Included cores

| # | System | Hub file | Canonical revision / source |
|---:|---|---|---|
| 1 | Game Boy / Game Boy Color / Game Boy Advance | `gbjsd.html` | `gbjsd_gba_audio_auto_fixed.html` |
| 2 | Master System / Game Gear | `segajsd.html` | Z80 + VDP Mode 4 + SN76489 core |
| 3 | Mega Drive / Genesis | `megadrivejsd.html` | MDJSD alpha 1.1 Raster Timing |
| 4 | Neo Geo AES/MVS | `neogeojsd.html` | `neogeojsd_v1425_dynamic_scb_trace.html` |
| 5 | NES / Famicom | `nesjsd.html` | `nesjsd_nested_zip(2).html` |
| 6 | SNES / Super Famicom | `snesjsd.html` | `snesjsd_alpha22c_STABLE.html` |
| 7 | PC Engine / TurboGrafx-16 / CD-ROM² | `pcejsd.html` | `pcejsd_cdrom_alpha20.html` |
| 8 | ColecoVision | `colecojsd.html` | Colecojsd M1.4 |
| 9 | ZX Spectrum 48K | `zx48jsd.html` | 48K core |
| 10 | MSX1 | `msx1jsd.html` | M1.0 |
| 11 | Intellivision | `intellijsd.html` | standalone CP1610 + STIC |
| 12 | Vectrex | `vectrex_emulator.html` | standalone MC6809 + VIA + AY |
| 13 | Capcom CPS-1 | `cps1jsd.html` | `cpsjsd_cps1_alpha28_video_sync_priority.html` |
| 14 | Commodore 64 | `c64jsd.html` | `c64jsd_alpha65_rotational_layout (1).html` |
| 15 | DOS / IBM PC | `dosjsd.html` | alpha 1.24 PM16 IDT VERIFIED |
| 16 | SEGA System 16 / Arcade | `system16jsd.html` | `Sega_Arcade_JSD_unified_alpha17_system16_audio.html` |

`laserdiscjsd_v1_0_daphne_timeline.html` remains a separate laboratory.

## Files refreshed in v0.2.9

This build is explicitly rebuilt from the latest available source file for:

- GB/GBC/GBA;
- NES;
- SNES;
- PC Engine/CD-ROM²;
- CPS-1;
- Commodore 64;
- SEGA System 16/Arcade.

Neo Geo remains on `neogeojsd_v1425_dynamic_scb_trace.html`, selected as the canonical revision in the previous build.

Hub integration is added **outside the emulator core** whenever possible: launcher handoff, Save Bridge and save flushing. For GB/GBA, the source file's existing handoff script is replaced with the corrected Hub variant while the two emulator-core scripts remain identical to the source.

## Neo Geo

The canonical file is `neogeojsd_v1425_dynamic_scb_trace.html`. Its internal version strings are not uniform: some locations report `v1.4.24`, while the footer reports `v1.4.6`. The Hub does not rewrite these strings and identifies the revision by the uploaded build filename.

This line includes:

- standard Neo Geo banking;
- NEO-SMA for KOF '99, Garou/GarouH, Metal Slug 3 and KOF 2000;
- Metal Slug X protection;
- NEO-PVC for Metal Slug 5 and KOF 2003;
- CMC42/CMC50 and NEO-PCM2 paths;
- improved LSPC/raster and palette banking;
- dynamic sprite/SCB and C-ROM diagnostics;
- Z80 + YM2610/WebAudio;
- uPD4990A RTC;
- persistent 64 KiB MVS backup RAM.

## Launcher

Open `index.html`.

The grid is generated from the same `SYSTEMS` table used for detection and shows **all 16 systems**. Every card can open its emulator without selecting a ROM first.

The launcher can analyse folders and archives using extensions, signatures, sizes, ZIP structure, MAME naming and BIOS/cartridge combinations.

Assisted-launch protocol:

`jsd-probe → jsd-emulator-ready → jsd-launch → jsd-launch-accepted`

The protocol is ignored during normal standalone use.

## ROMs, ZIPs and archives

Support depends on the core:

- **NES:** `.nes`, one-ROM ZIPs and collection/nested ZIPs;
- **SNES:** `.sfc`, `.smc`, ZIP/nested ZIP; the source core also offers optional 7Z support through `7z-wasm`, downloaded only when a `.7z` file is opened;
- **PC Engine:** HuCard plus CD-ROM²/Super CD-ROM² through ZIP or CUE + BIN/ISO/WAV;
- **Neo Geo / CPS-1 / System 16:** MAME sets with chip classification;
- **C64:** PRG, D64, T64, TAP, CRT and ZIP;
- **DOS:** IMG/IMA/HDD/DSK and packages containing EXE/COM/BAT.

No remote JavaScript dependency is mandatory to start the Hub or the cores. The only currently documented optional network dependency is SNES 7Z opening.

The launcher cache stores **metadata only**, never persistent copies of ROM contents.

## Saves

### Persistent savegames

The central Save Manager uses short-lived iframes and `postMessage` to query standalone cores directly. It does not assume separate `file://` HTML pages always share the same `localStorage` namespace.

| System | Current persistence |
|---|---|
| GB/GBC | battery RAM + RTC |
| GBA | SRAM/Flash/EEPROM-marked save buffer; unusual EEPROM/serial cases still need validation |
| SMS/GG | Hub-layer persistent SRAM |
| Mega Drive | cartridge SRAM |
| Neo Geo MVS | 64 KiB backup RAM |
| NES | PRG RAM/SRAM |
| PC Engine / CD | Backup RAM / BRAM |
| DOS | modified HDD sectors through the core's IndexedDB storage |

**SNES:** the current core reads SRAM information from the cartridge header, but cartridge SRAM mapping and persistence are not yet fully implemented.

### Neo Geo

The MVS backup key remains:

`neogeojsd.mvs.backup.v137`

Existing MVS backup RAM created by the previous Hub Neo Geo build therefore remains compatible.

### Save states

Full save states are emulator- and revision-specific. They are not treated as interchangeable across different cores or versions.

## Debuggers and performance

Suite rule: expensive tracing/debugging must be **disabled for normal gameplay**.

- NES CPU trace is off by default;
- SNES alpha 0.22c starts in performance mode with CPU trace unchecked;
- Neo Geo exposes trace/performance controls;
- CPS-1/C64/System 16 diagnostic tools should remain outside the normal execution path whenever possible.

The launcher must not introduce per-frame polling into running emulator cores.

## Disassemblers and resource extraction

| System | Disassembler | Resource extraction / inspection |
|---|---|---|
| GB/GBC/GBA | ✅ LR35902 + ARM/Thumb | ✅ tiles, OBJ/OAM, VRAM, frame, JSON |
| SMS/GG | ✅ Z80 | ◐ tile/VRAM/CRAM; sprite/audio export incomplete |
| Mega Drive | ◐ 68000; audio Z80 incomplete | ◐ tile/palette/sprite viewer |
| Neo Geo | ✅ 68000 + Z80 | ◐ FIX/C-ROM PNG + P-ROM CPU view; audio export incomplete |
| NES | ✅ 6502/2A03 | ✅ CHR PNG, OAM JSON, frame PNG, memory dump |
| SNES | ✅ 65C816 | ◐ tile/VRAM; OAM/CGRAM/BRR incomplete |
| PC Engine | ✅ HuC6280 | ◐ tile/BAT/VRAM/palette; sprite/audio export incomplete |
| ColecoVision | ✅ Z80 | ✅ sprite + audio |
| ZX Spectrum | ✅ Z80 | ✅ screen/crop + beeper |
| MSX1 | ✅ Z80 | ✅ sprite + audio |
| Intellivision | ✅ CP1610 | ✅ sprite/card + sound |
| Vectrex | ✅ 6809 | ✅ SVG/vector JSON + WAV/AY JSON |
| C64 | ✅ 6510 | ◐ graphics; structured SID export incomplete |
| DOS | ❌ | ❌ |
| CPS-1 | ◐ 68000; audio Z80 incomplete | 👁 graphics viewer, full export still missing |
| System 16 | ◐ 68000; audio Z80 incomplete | ◐ tile/sprite viewer, sprite/audio export incomplete |

## SEGA arcade core note

`system16jsd.html` comes from **Sega Arcade JSD unified alpha 0.17**. In addition to the System 16B path, the file contains unified System C/C2 and Mega-Tech/Mega Play logic. The Hub still exposes it as a separate System 16/Arcade entry rather than replacing the working standalone Mega Drive core.

## Project principles

1. Every core must remain usable standalone.
2. No commercial ROM or BIOS is distributed in the package.
3. The launcher must not rewrite CPU/video/audio logic in a working core.
4. Shared Hub features should be external layers whenever possible.
5. Expensive debugger/trace modes stay off by default.
6. Compatibility fixes should be localised and avoid regressions in already-working games.

## Documentation

- `README.md` / `README_IT.md` — Italian guide
- `README_EN.md` — English guide
- `TODO.md` / `TODO_IT.md` — Italian work plan
- `TODO_EN.md` — English work plan
- `SAVE_SYSTEM.md` — Save Bridge architecture
- `SAVE_TEST_REPORT.md` — save verification report
- `ROM_DETECTION.md` — ROM detection rules
- `STANDALONE.md` — standalone-core rules
- `DEBUGGER_NOTES.md` — debugger/performance notes
- `DEPENDENCIES.md` — runtime dependencies and APIs
- `CORE_SOURCE_HASHES.json` — SHA-256 values of the source files used for the v0.2.9 refresh

## Status

These cores are experimental. “Integrated” does not mean complete compatibility with an entire commercial library. The priority is to preserve already-working software and fix reproducible issues without introducing broad regressions.
