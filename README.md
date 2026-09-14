# JSD Emulator Hub

JSD Emulator Hub is a browser-based collection of experimental emulators designed not only to run software, but also to act as a **reverse-engineering and asset-recovery laboratory**.

The project focuses on inspecting how classic machines work and, where the hardware and ROM format allow it, on:

- disassembling or heuristically reconstructing machine code;
- identifying code, data, entry points, jumps and calls;
- inspecting ROM, RAM, VRAM, CPU registers and execution traces;
- extracting tiles, sprites, OAM data, palettes, vector frames and other graphics resources;
- capturing sound-chip writes and registers;
- reconstructing or exporting audio as WAV/JSON where supported.

Each emulator remains a **separate standalone HTML file**. The launcher identifies supported systems, can inspect ZIP archives, and passes ROM/BIOS files only when they match the expected format.

> **Important:** the original source code of a commercial ROM cannot be faithfully recovered. Variable names, comments, macros, original source files, art tools and the original project structure are normally absent from the ROM. The reverse-engineering tools in this project produce a technical reconstruction useful for understanding the program, not the original source code.

---

## Included systems

| System | Emulator | CPU / main hardware | Reverse-engineering focus |
|---|---|---|---|
| Game Boy / Game Boy Color / Game Boy Advance | `gbjsd.html` | LR35902 / ARM7TDMI | Disassembly, memory, tiles, OAM, palettes |
| SEGA Master System / Game Gear | `segajsd.html` | Z80 / VDP / SN76489 | Z80 listing, VRAM/CRAM, tile atlas |
| ColecoVision | `colecojsd.html` | Z80 / TMS9918A / SN76489A | Z80 analysis, sprites, VRAM, sound capture |
| ZX Spectrum 48K | `zx48jsd.html` | Z80 / ULA / beeper | Trace, memory, disassembly, screen/audio capture |
| MSX1 | `msx1jsd.html` | Z80 / TMS9918A / AY-3-8910 | Z80 analysis, sprites, VDP, sound registers |
| Vectrex | `vectrex_emulator.html` | Motorola 6809 / VIA 6522 / AY-3-8912 | 6809 disassembly, vector capture, sound export |
| Intellivision | `intellijsd.html` | CP1610 / STIC / AY-3-8914 | CP1610 analysis, code/data detection, sprite/audio extraction |

The project launcher is available as:

- `index.html` — GitHub Pages entry point
- `landing.html` — launcher page
- `help.html` — full bilingual help

---

## Running the project

The project is entirely client-side.

For local use, open `index.html` or `landing.html` in a modern browser. For GitHub Pages, publish the repository root as a static site.

No commercial BIOS or game ROM is included.

### Launcher behaviour

The launcher can inspect a complete folder and, when supported by the browser, files contained inside ZIP archives.

System detection uses a combination of:

- file extensions;
- expected file sizes;
- known headers and signatures;
- system-specific ROM patterns.

Examples include the Nintendo logo, GBA header data, `TMR SEGA`, Coleco headers and MSX cartridge headers.

### ZIP limitations

Interesting ROM entries are extracted in memory when the browser supports the compression method.

The following may not be extractable:

- encrypted ZIP archives;
- ZIP64 archives;
- uncommon or unsupported compression methods.

Files remain local to the browser.

### BIOS handling

A file is **not** selected as a BIOS merely because it uses `.bin` or `.rom`.

Where a BIOS is required, the launcher checks the expected system, size and identifying name/signature.

For the included **Game Boy/GBC/GBA** and **SEGA Master System/Game Gear** builds, the launcher does not automatically load a BIOS because normal operation does not require one.

---

# What “decompiling” a ROM means

A commercial ROM contains machine code and data rather than the original development project.

The tools therefore operate at several levels.

### Disassembly

Machine instructions are converted to readable assembly for the relevant CPU, including:

- Z80
- LR35902
- ARM / Thumb
- Motorola 6809
- CP1610

### Heuristic analysis / decompilation

Where implemented, the analyser attempts to:

- distinguish reachable code from data;
- follow branches, calls and returns;
- identify entry points;
- create synthetic labels;
- use runtime traces to improve static analysis;
- classify manually defined memory regions.

This is not equivalent to recovering the original C, C++, assembler source or development environment.

### Memory and trace

Depending on the emulator, the interface can expose:

- ROM;
- RAM;
- VRAM;
- CPU registers;
- graphics registers;
- sound-chip registers;
- recent instructions;
- runtime control transfers;
- execution traces.

### Graphics extraction

The type of resource that can be extracted depends on the original hardware.

Systems with hardware tiles and sprites can expose resources close to the underlying game assets. Bitmap systems such as the ZX Spectrum do not have hardware sprites, so the appropriate operation is screen capture/cropping. Vectrex graphics are vector-based, so SVG/JSON vector export is more meaningful than sprite extraction.

### Sound extraction

When supported, the emulator may capture sound-chip writes or registers and export them as JSON or reconstruct the resulting audio as WAV.

A reconstructed WAV represents the sound produced by the current emulation model. It does **not** imply that a WAV file existed inside the original ROM.

---

# Emulator reference

## Game Boy / Game Boy Color / Game Boy Advance

**File:** `gbjsd.html`

### Files and boot

Supported ROM types include:

- `.gb`
- `.gbc`
- `.gba`
- `.bin` where appropriate

The launcher requires no external BIOS.

GB/GBC use the internal Game Boy core. GBA uses a separate core loaded when needed.

### Controls

| Key | Function |
|---|---|
| Arrow keys / `WASD` | D-pad |
| `Z` | A |
| `X` | B |
| `Enter` | Start |
| `Shift` | Select |
| `Q` | GBA L |
| `E` | GBA R |

### Reverse engineering

GB/GBC provide:

- CPU-mapped memory view;
- physical ROM view;
- bank-aware LR35902 disassembly;
- ASM export.

GBA provides static ARM7TDMI analysis covering ARM/Thumb instructions including:

- branches;
- loads/stores;
- ALU instructions;
- stack operations;
- SWI instructions.

### Graphics and audio

GB/GBC extraction includes:

- 2bpp tiles;
- tilemaps;
- OAM.

GBA extraction includes:

- 4bpp and 8bpp BG/OBJ tiles;
- palettes;
- up to 128 OAM objects.

Available exports include PNG/JSON and screenshots.

For GB/GBC, the audio monitor exposes the four-channel APU and its state.

### Save data

State and RAM import/export are available where supported by the active mode.

### Limitations

The GBA core is separate and uses an experimental HLE BIOS.

The project remains experimental. GB/GBC audio models many details but does not reproduce every analogue quirk or every cycle-perfect edge case.

GBA disassembly is static and does not reconstruct the original C/C++ source.

---

## SEGA Master System / Game Gear

**File:** `segajsd.html`

> This build is **not** a Mega Drive / Genesis emulator.

### Files and BIOS

Supported ROM formats:

- `.sms`
- `.gg`
- ZIP archives containing those formats

The BIOS is optional and is **not auto-loaded by the launcher**.

### Controls

| Key | Function |
|---|---|
| Arrow keys / `WASD` | D-pad |
| `Z` | Button 1 |
| `X` | Button 2 |
| `Enter` | Game Gear Start / Master System Pause NMI |

### Reverse-engineering tools

- CPU memory view;
- ROM/RAM/SRAM inspection;
- Z80 trace;
- static Z80 listing;
- ASM export;
- PNG screenshots;
- VRAM export;
- CRAM export;
- live 4bpp tile atlas;
- SMS and Game Gear palette handling.

### Options

- NTSC / PAL;
- SEGA mapper;
- Codemasters mapper;
- pixel / scanline / CRT effects;
- emulation speed;
- machine state.

### Limitations

The build covers only Master System and Game Gear.

Exposed mapper support is primarily:

- SEGA + SRAM;
- Codemasters.

Titles requiring different hardware or mapper behaviour may fail.

The disassembler operates on the currently mapped Z80 address space.

---

## ColecoVision

**File:** `colecojsd.html`

### Files and BIOS

An **8 KiB ColecoVision BIOS** is required.

Supported cartridge formats can include:

- `.col`
- `.cv`
- `.rom`
- `.bin`

when valid for the system.

### Controls

#### Player 1

- mouse or Arrow keys / `WASD`
- `Z` / `X` — action buttons
- `0–9`, `*`, `#` — keypad

#### Player 2

- `I J K L` — directions
- `N` / `M` — buttons

Mouse control can capture the pointer when the screen is clicked. `Esc` releases it. Sensitivity and vertical-axis inversion are available.

### Reverse engineering

- Z80 registers;
- memory inspection;
- VRAM inspection;
- VDP registers;
- I/O trace;
- heuristic Z80 decompiler/analyser;
- header-based, `$8000`, or manual entry point;
- ASM export;
- diagnostic report.

### Graphics and audio

Capture can run for roughly 600 VBlanks (about 10 seconds).

Available data can include:

- TMS9918A sprites;
- sprite PNG;
- sprite JSON;
- VRAM;
- SN76489A state;
- sound-chip writes;
- sound JSON;
- reconstructed WAV.

### Limitations

The Z80 reconstruction is heuristic and is not the original source.

The current build targets base ColecoVision hardware and does not advertise dedicated support for extensions such as ADAM or SGM.

Cartridges requiring additional peripherals or hardware are not guaranteed to work.

---

## ZX Spectrum 48K

**File:** `zx48jsd.html`

### Files

The system ROM must be exactly **16,384 bytes**.

Supported system ROM extensions:

- `.rom`
- `.bin`

Supported game/screen formats include:

- `.sna`
- `.z80` (48K)
- `.tap`
- `.scr`

### Keyboard

| Key | Function |
|---|---|
| Physical letters/numbers | Original Spectrum keyboard |
| `Shift` | CAPS SHIFT |
| `Ctrl` | SYMBOL SHIFT |
| `Backspace` | Delete |

### Joystick

- Arrow keys — direction
- `Alt` — fire

Available joystick modes include:

- Kempston;
- Sinclair 2;
- Cursor;
- QAOP + Space;
- disabled.

An optional mouse joystick mode uses the centre as neutral and the left mouse button as fire.

### Tape

For TAP files, use:

```text
LOAD ""
```

from BASIC.

Available tape controls include:

- Play;
- Stop;
- Rewind;
- fast loading through the standard ROM loading routine.

### Reverse engineering / extraction

- Z80 registers;
- instruction step;
- frame step;
- trace of the last ~160 instructions;
- memory dump;
- disassembler;
- listing export;
- RAM export;
- screen capture and PNG cropping;
- 1-bit beeper capture;
- WAV/JSON audio export for recordings up to roughly 30 seconds.

### Limitations

This is a **ZX Spectrum 48K** emulator only.

Not implemented:

- Spectrum 128K;
- AY audio;
- floppy support;
- TZX support.

RAM/ULA contention, floating bus behaviour and some internal bus timings are not reproduced precisely.

Raster effects, unusual loaders and some timing-sensitive games may therefore require fixes.

The internal diagnostic demo tests the CPU/video/audio path, not the entire Spectrum software catalogue.

---

## MSX1

**File:** `msx1jsd.html`

### Files and BIOS

A **32 KiB MSX1 Main BIOS** is required.

Supported cartridge formats include:

- `.mx1`
- `.rom`
- `.bin`

Emulated RAM: **64 KiB**.

Supported cartridge mapping includes standard, ASCII and Konami mapper types.

### Controls

The physical keyboard drives the MSX keyboard matrix.

#### Joystick P1

- Arrow keys / `WASD`
- `Z` / `X`

#### Joystick P2

- `I J K L`
- `N` / `M`

Mouse control over the display can also drive Player 1 with the centre as neutral and mouse clicks as buttons.

### Reverse engineering

- Z80 registers;
- memory;
- VDP state;
- trace;
- heuristic cartridge analysis;
- explicit entry points;
- original-byte display;
- ASM export.

### Graphics and audio

Capture can run for approximately 600 VBlanks (~10 seconds).

Available exports can include:

- TMS9918A sprites;
- sprite PNG/JSON;
- AY-3-8910 registers;
- sound JSON;
- WAV where implemented.

### Limitations

This is a base **MSX1** build.

Not emulated:

- cassette;
- floppy disk;
- subslots;
- SCC audio.

It is not MSX2. There is no:

- V9938;
- Sub-ROM;
- MSX2 RAM mapper;
- MSX2 video mode support.

---

## Vectrex

**File:** `vectrex_emulator.html`

### Files and BIOS

Supported cartridge formats:

- `.vec`
- `.rom`
- `.bin`

Commercial cartridges require both the cartridge ROM and the original BIOS.

Without a cartridge ROM, the built-in vector demo remains available.

### Controls

| Key | Function |
|---|---|
| Arrow keys / `WASD` | Joystick |
| `Z` | Button 1 |
| `X` | Button 2 |
| `C` | Button 3 |
| `Space` | Additional fire/button input |
| `Enter` | Start |
| `R` | Reset |
| `P` | Pause / Resume |

### Reverse engineering

- Motorola 6809 CPU state;
- memory inspection;
- trace;
- 6809 disassembler;
- disassembly from a selected address or current PC;
- ASM export.

### Shapes and sound

Vectrex constructs the display dynamically from vectors.

Capture can record up to approximately 300 samples (~10 seconds at 1×) and export:

- a frame as SVG;
- vector sequence JSON;
- AY register JSON;
- reconstructed WAV from the three tone channels.

### Implementation / limitations

The build reports support for:

- VecX-style emulation;
- reset through vector `$FFFE`;
- VIA timers;
- VIA shift register;
- DAC/integrators;
- AY registers and audio.

Commercial BIOS and ROM files are not included and must be provided by the user.

WAV export represents the current audio emulation model and does not reconstruct original music source files.

---

## Intellivision

**File:** `intellijsd.html`

The package contains the **complete standalone M5.0 core**. It no longer opens the previously deployed remote site and can run locally/offline like the other emulator files.

### Files

#### Executive ROM

- 4K words / **8 KiB**
- mapped at `$1000`

#### GROM

- **2 KiB**
- mapped at `$3000`

#### Cartridge

The launcher recognises **`.int`** files as Intellivision game cartridges.

Generic `.bin` or `.rom` files are **not** treated as game cartridges. They are considered Intellivision files only when they match EXEC or GROM by expected name and exact size.

### Main controls

| Key | Function |
|---|---|
| `WASD` | Directional disc |
| `0–9` | Numeric keypad |
| `Z` / `X` / `C` | Side actions |

Virtual controls expose:

- the directional disc;
- numeric keypad;
- CLR;
- ENT;
- side buttons.

### Analysis

M5.0 exposes:

- CP1610 state;
- memory inspection;
- execution events;
- AY-3-8914 PSG information;
- reverse-engineering tools.

Intellicart images may contain:

- segments;
- RAM/ROM attributes;
- fine access restrictions;
- bank switching.

### Reverse engineering

The analysis tools can reconstruct CP1610 assembly and identify code, data and entry points where possible.

As with the other systems, this does not recover the original source project.

---

# Common interface commands

| Command | Meaning |
|---|---|
| Power | Starts or stops the emulated machine when the core exposes power control |
| Reset | Resets CPU and peripherals without necessarily reloading files |
| Pause / Resume | Stops emulation progress while preserving the current state |
| Step | Runs one instruction or one frame depending on the core |
| Audio | Web Audio usually requires an explicit user gesture before playback is allowed |
| Fullscreen | Core fullscreen enlarges the emulator display; launcher fullscreen enlarges the entire emulator |
| State | Save states are emulator/version-specific and are not interchangeable |

Press `Esc` to leave browser fullscreen.

---

# Project limitations

JSD Emulator Hub is an experimental independent project.

In general:

- the emulators are not guaranteed to be cycle-perfect;
- timing-sensitive titles may expose inaccuracies;
- individual mapper/peripheral support varies between systems;
- static disassembly can confuse data with code;
- runtime traces only reveal code that actually executes;
- reconstructed graphics and audio are based on the emulated hardware state rather than original development assets;
- save states should not be assumed compatible between emulator versions.

No BIOS or commercial game is included in this repository.

Use ROMs, BIOS files and other software only when you are legally entitled to do so.

---

# GitHub Pages

This repository is ready to be hosted as a static GitHub Pages site.

The root `index.html` acts as the entry point.

A `.nojekyll` file is included so GitHub Pages serves the project as plain static files.

Typical repository structure:

```text
.
├── index.html
├── landing.html
├── help.html
├── gbjsd.html
├── segajsd.html
├── colecojsd.html
├── zx48jsd.html
├── msx1jsd.html
├── vectrex_emulator.html
├── intellijsd.html
├── emulator-autoload.js
├── .nojekyll
└── README.md
```

---

## Purpose of the project

The primary aim is to make classic-console emulation useful as an **interactive technical workbench**.

Running the software is only one part of the goal. The other part is to make the machine observable: code, memory, graphics and sound should be inspectable and exportable whenever the underlying hardware model allows it.
