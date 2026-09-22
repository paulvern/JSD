# JSD Emulator Hub — TODO

> Italiano: [TODO_IT.md](TODO_IT.md)

This TODO replaces the accumulated historical lists from older releases. It contains only useful remaining work and checks worth keeping.

## Priority 0 — do not break working cores

- [ ] Every core change should have a reproducible regression case.
- [ ] Avoid global timing, palette, banking or memory fixes when the problem is game/board-specific.
- [ ] Preserve standalone HTML files: no core may depend on `index.html`.
- [ ] Expensive debugger/trace paths OFF by default, with no permanent CPU/memory hooks.
- [ ] Before replacing a Hub core, compare the proposed revision with the included one and record known regressions.

## Priority 1 — Hub end-to-end testing

- [ ] Real-browser test of all 16 “Open emulator” cards without a ROM.
- [ ] Test `jsd-probe → jsd-emulator-ready → jsd-launch → jsd-launch-accepted` on all 16 systems.
- [ ] Test automatic loading with ZIP, nested ZIP, multiple BIOS files and MAME sets.
- [ ] Verify `file://` behaviour on Chrome/Chromium, Firefox and Edge.
- [ ] Invalidate folder-analysis cache whenever system tables or detection logic change.

## Priority 2 — saves

- [x] Save Bridge for GB/GBC/GBA, SMS/GG, Mega Drive, Neo Geo, NES and PC Engine.
- [x] JSON restore can recreate missing save keys.
- [x] NES SRAM flush on `pagehide`/close.
- [x] Neo Geo compatibility with `neogeojsd.mvs.backup.v137` retained.
- [ ] **SNES: implement real cartridge SRAM**, mapping + persistence + import/export.
- [ ] Standardise persistence for future cores that gain battery-backed RAM.
- [ ] Add optional post-import verification to Save Manager: re-read slot and compare size/hash.
- [ ] Real-browser export → delete → import → re-read tests for every bridged system.
- [ ] Consider portable export/import for DOS IndexedDB HDD sectors, separate from save states.

## Priority 3 — Neo Geo

Current core: `neogeojsd_v1425_dynamic_scb_trace`.

- [ ] In a future core revision only, normalise internal version strings (v1425 filename, v1.4.24 log/report, v1.4.6 footer).
- [ ] Verify Garou/GarouH characters, dynamic SCBs, C1-C8, palettes and priority.
- [ ] Verify KOF '99, Metal Slug 3 and KOF 2000 NEO-SMA profiles.
- [ ] Verify Metal Slug X `$2FFFE0-$2FFFEF` ALTERA protection window.
- [ ] Verify Metal Slug 5 and KOF 2003 NEO-PVC/CMC50/PCM2 path.
- [ ] Compare sprite zoom/SCB short/tall chains and active-sprite buffers against hardware/MAME/FBNeo references without replacing working rendering wholesale.
- [ ] Improve YM2610 only with A/B tests on known games; avoid regressions in M1/Z80 command handoff.
- [ ] Add structured audio export: YM2610 register log, Z80 command log and optional diagnostic WAV/capture.
- [ ] Keep MVS backup RAM and RTC independent from watchdog resets.

## Priority 4 — SNES

- [ ] Persistent cartridge SRAM.
- [ ] OAM/OBJ extractor with PNG + JSON.
- [ ] CGRAM/palette export.
- [ ] Tilemap/background export for Modes 0-7 where reconstructable.
- [ ] SPC700/S-DSP resources: BRR sample extraction, DSP directory and ADSR/GAIN metadata.
- [ ] Timing/performance checks without continuous debugger overhead.
- [ ] Re-test historically difficult titles: Rampart, Dracula X, Art of Fighting, Mortal Kombat, Mario Kart.

## Priority 5 — DOS

DOS remains the largest tooling gap.

- [ ] Static x86 16/32-bit disassembler covering at least 8086/286/386 real/protected mode.
- [ ] segment:offset + linear/physical address view.
- [ ] Text/VGA text-mode export.
- [ ] CGA/EGA/VGA framebuffer and DAC palette export.
- [ ] VGA font and plane-data capture.
- [ ] Sound Blaster/OPL register logging and diagnostic WAV capture.
- [ ] Portable export/import of IndexedDB HDD modifications.
- [ ] Continue protected-mode/IDT testing without game-specific CPU shortcuts.

## Priority 6 — CPS-1

- [ ] Turn the graphics viewer into a real extractor: tile/sprite PNG, palettes and metadata.
- [ ] Z80 audio disassembler.
- [ ] Export relevant CPS-A/CPS-B priority/layer registers.
- [ ] Verify sprite priority/layers without changing the current default 30 FPS timing.
- [ ] Re-test Captain Commando, Cadillacs and Dinosaurs, Pang/Pang3, Varth and Street Fighter II.

## Priority 7 — Mega Drive and System 16

### Mega Drive
- [ ] Z80 audio disassembler.
- [ ] Real VDP sprite export, not viewer only.
- [ ] Plane A/B/window tilemap + CRAM/VSRAM export.
- [ ] Improve YM2612/PSG without affecting raster timing or DMA.

### System 16
- [ ] Z80 audio disassembler.
- [ ] Sprite/tilemap export with attributes and priority.
- [ ] YM2151/uPD7759 capture/export.
- [ ] Expand mapper profiles only with verified sets.

## Priority 8 — PC Engine CD ALPHA 20

- [ ] Keep **CD ALPHA 20** as the reference; do not fall back to COMPAT V8/Alpha 19.
- [ ] Test HuCard and CD-ROM²/Super CD-ROM² in the same core.
- [ ] Verify CUE + BIN/ISO/WAV, CD-DA and ADPCM.
- [ ] Dedicated sprite export in addition to the viewer.
- [ ] Improve PSG/CD/ADPCM diagnostic extraction.
- [ ] Keep BRAM/Backup RAM connected to Save Bridge.

## Priority 9 — NES

Current core: nested-ZIP revision introduced in v0.2.7.

- [ ] Re-test mappers 0/1/2/3/4/7/66 with SRAM.
- [ ] Add mappers only with targeted test ROMs.
- [ ] DMC APU.
- [ ] More accurate PPU timing for sprite-0/MMC3 IRQ-sensitive games.
- [ ] Improve large ZIP collection handling without loading irrelevant files into memory.
- [x] CHR PNG, OAM JSON, frame PNG and 6502/2A03 disassembler already present.

## Priority 10 — C64

- [ ] Improve SID quality/timing without breaking TRUE 1541.
- [ ] Structured SID capture: register log over frame/cycle and diagnostic WAV.
- [ ] Re-test games with arithmetic/timing issues, raster effects and multi-file loaders.
- [ ] Optimise 1541 while preserving the full physical D64 path.

## Priority 11 — GB/GBC/GBA

- [ ] Keep the GBA AUDIO AUTO FIX / UI FAST build.
- [ ] Test GBA DMA/FIFO audio and A/V synchronisation.
- [ ] Remove any residual debugger/trace cost from normal execution.
- [ ] Expand GBA extraction without disturbing working GB/GBC cores.

## Priority 12 — SMS/GG, Coleco, MSX, Spectrum, Intellivision, Vectrex

- [ ] SMS/GG: sprite and structured audio export.
- [ ] Coleco M1.4: preserve sprite/audio extractor and verify input compatibility.
- [ ] MSX1: expand mappers/cartridges only with test ROMs.
- [ ] Spectrum: improve TAP/loader while keeping the 48K target.
- [ ] Intellivision: continue controller improvements without disturbing stable CPU/STIC behaviour.
- [ ] Vectrex: analogue/VIA/AY timing and cartridge compatibility while preserving SVG/WAV/AY JSON export.

## Priority 13 — documentation and releases

- [ ] Update README/TODO whenever a canonical core is replaced.
- [ ] Keep one canonical version per system in a release package.
- [ ] Record the exact source filename when internal version labels are ambiguous.
- [ ] Run `node --check` on every inline script before packaging.
- [ ] Ensure there are no mandatory external `<script src>` dependencies.
- [ ] Verify 16/16 launcher target files.
- [ ] Run `unzip -t` on the final package.
