# JSD Emulator Hub — riconoscimento ROM

Questa nota descrive le regole usate da **`index.html`**. Il launcher riconosce il sistema e può aprire il relativo HTML standalone in una nuova scheda, trasferendo la ROM selezionata e gli eventuali BIOS attraverso il ricevitore opzionale JSD Hub.

## Principio

Il riconoscimento combina, in ordine di affidabilità:

1. **firma/header del formato**, quando esiste;
2. **estensione specifica**;
3. **struttura di un set ZIP**;
4. **coppia BIOS + cartuccia** per piattaforme con file raw ambigui;
5. **nome della cartella/file** solo come indizio contestuale.

I formati raw `.bin/.rom` non hanno sempre una firma universale. In quei casi il launcher usa il contesto o lascia disponibile la scelta manuale del sistema.

## Regole per piattaforma

| Sistema | Segnali forti usati dal launcher | File che il relativo emulatore accetta |
|---|---|---|
| Game Boy / GBC / GBA | `.gb/.gbc/.gba`; logo Nintendo GB a `$0104`; header GBA con byte `$96` a `$B2` | `.gb .gbc .gba .bin` |
| Master System / Game Gear | `.sms/.gg`; firma `TMR SEGA` a `$1FF0/$3FF0/$7FF0` | `.sms .gg .zip` |
| Mega Drive / Genesis | `.md/.gen/.smd`; stringa `SEGA` nell'header a `$100`; `.bin` solo se l'header è coerente | `.bin .md .gen .smd .zip` |
| Neo Geo AES/MVS | set MAME ZIP con `P1..P4`, `S1`, `M1`, `V1..`, `C1..`; `neogeo.zip`/UniBIOS per BIOS | ZIP MAME e ROM board separate |
| NES / Famicom | `.nes`; firma `NES 1A` (iNES) | `.nes .zip` |
| SNES / Super Famicom | `.sfc/.smc`; anche dentro ZIP e ZIP annidati | `.sfc .smc .zip` |
| PC Engine / TurboGrafx-16 | `.pce/.sgx`; `.hes` o firma `HESM`; `.bin/.rom` se la cartella/nome dà contesto PCE | `.pce .bin .rom .hes .zip` |
| ColecoVision | `.col/.cv`; firma iniziale `AA55` o `55AA`; BIOS Coleco + raw come contesto | `.bin .rom .col .cv` |
| ZX Spectrum 48K | `.sna/.z80/.tap/.scr`; ROM 16 KiB con nome BIOS/ZX/Spectrum | BIOS `.rom/.bin`; giochi `.sna .z80 .tap .scr` |
| MSX1 | `.mx1`; firma `AB` a offset 0 o `$4000`; BIOS MSX + cartuccia raw | BIOS `.bin/.rom`; giochi `.bin .rom .mx1` |
| Intellivision | `.int/.img`; formato Intellicart con firma `$A8`; coppia Executive 8 KiB + GROM 2 KiB + altra cartuccia raw | Executive/GROM/cart `.bin .rom .int .img` |
| Vectrex | `.vec`; header testuale `g GCE`; BIOS Vectrex/GCE 8 KiB + altra cartuccia raw | cart `.bin .rom .vec .zip`; BIOS `.bin .rom .zip` |

## ZIP

Il launcher ora considera anche un file `.zip` come elemento interessante **prima** di conoscerne il contenuto. Questo è essenziale per raccolte del tipo:

`collection.zip -> gioco1.zip -> gioco1.sfc`

Viene scandito un livello di ZIP annidato. Per Neo Geo, il gioco resta classificato come ZIP completo perché il core richiede il set P/S/M/V/C, non un singolo chip.

## Formati intrinsecamente ambigui

- **PC Engine `.bin/.rom`**: non esiste una firma universale affidabile per tutte le HuCard. Senza estensione `.pce`, firma HES o contesto nel nome/cartella, il launcher non può distinguerlo con certezza da altre ROM raw.
- **Intellivision `.bin` raw**: una cartuccia raw non ha sempre una firma; Executive+GROM o formato Intellicart `$A8` rendono il riconoscimento affidabile.
- **Vectrex `.bin/.rom`**: molte cartucce hanno l'header `g GCE`; homebrew non conformi possono richiedere la scelta manuale.
- **Coleco/MSX raw**: il launcher usa rispettivamente `AA55/55AA` e `AB`; dump atipici possono richiedere override manuale.

## Diagnostica

`index.html` contiene **Diagnostica riconoscimento**. Mostra il punteggio assegnato a ogni piattaforma e gli indizi che lo hanno prodotto. Serve soprattutto quando più sistemi condividono `.bin` o `.rom`.


## Cache dell’analisi

Il launcher salva in `localStorage` soltanto il **manifest dell’analisi**: percorsi, dimensioni, timestamp, firme rilevate, struttura ZIP e punteggi. I byte delle ROM non vengono duplicati in localStorage.

Quando l’utente riseleziona una cartella con la stessa firma (percorsi + dimensioni + `lastModified`), il manifest viene riutilizzato. Il pulsante **Refresh analisi** forza la scansione dei file e degli ZIP e sostituisce la cache.

Per una ROM dentro ZIP, i byte vengono estratti soltanto al momento dell’avvio del gioco.
