# Standalone invariant

Ogni emulatore distribuito in questa cartella deve poter essere copiato e aperto come singolo file HTML.

## Regole

- nessun `<script src=...>` richiesto a runtime;
- nessun foglio di stile esterno richiesto;
- nessun bridge `emulator-autoload`;
- nessun `postMessage` obbligatorio verso il launcher; il ricevitore JSD Hub è opzionale e inattivo nell’uso standalone;
- eventuale codice condiviso di sviluppo viene incorporato nell’HTML di release;
- ROM, BIOS, save e media sono scelti dall’interfaccia del singolo emulatore.

## Launcher

`index.html` può analizzare una cartella e aprire il sistema in una nuova scheda. Quando l’avvio nasce dall’Hub, può trasferire ROM/BIOS tramite un ricevitore opzionale incorporato nel singolo HTML. Aprendo l’HTML direttamente, lo stesso core continua a funzionare senza Hub.

## Verifica della build v0.2.3

La build è stata controllata staticamente per:

- assenza di `<script src>` negli emulatori;
- assenza di stylesheet esterni;
- assenza dei vecchi bridge `emulator-autoload`;
- sintassi JavaScript valida degli script inline.


### Handoff opzionale v0.2.3

Quando il core viene aperto dall’Hub, non presume che `window.opener` sia disponibile. `index.html` invia un probe alla nuova scheda e il core risponde direttamente al `WindowProxy` sorgente del messaggio. In uso standalone questo codice resta inattivo.


I nuovi core CPS-1, C64, DOS e System 16 seguono lo stesso principio: il ricevitore Hub è aggiunto in coda al file e usa gli input file già esistenti, senza sostituire il core o la sua UI standalone.
