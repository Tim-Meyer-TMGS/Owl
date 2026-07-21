# Der große Konkurrent – Level 9 bis 12

Stand: 21. Juli 2026

Kapitel 3 ist ein freundschaftliches horizontales Wettrennen. Lumi und Bruno fliegen durch dieselbe handgesetzte Torfolge und erreichen anschließend einen beweglichen Nachtfalter. Es gibt keine Schadens-, Beutediebstahl- oder Niederlagenlogik.

## Daten und Ablauf

`data/race-tracks.json` definiert vier Strecken mit insgesamt 30 Toren, Flugrichtung, Brunos Tempo, Windschattenzone und Falterbewegung. `js/systems/race.js` wertet Tore strikt der Reihe nach aus, steuert Bruno und bewegt den Falter.

- Level 9: sechs breite Einführungstore und Brunos Brillenanimation.
- Level 10: sieben Tore in umgekehrter Flugrichtung.
- Level 11: acht engere Höhenwechsel mit stärkerem Windschattenfokus.
- Level 12: neun Tore; der Abschluss schaltet Bruno dauerhaft als Verbündeten frei.

Hinter Brunos Flügeln entsteht eine sichtbare Windschattenzone. Sie gibt einen sanften Vorwärtsimpuls, ohne die Steuerung oder Höchstgeschwindigkeit durch einen zusätzlichen Multiplikator zu verändern.

## Darstellung und Audio

- Handgezeichnete ovale Wipfeltore mit klarer aktiver Stufe.
- Bruno verwendet schweren Flügelschlag, geneigte Brillen-/Körperanimation und Windbänder.
- Der Nachtfalter besitzt eine eigenständige flatternde Bewegung.
- Tore, Windschatten und Falter verwenden getrennte prozedurale Klangmotive; Bruno behält sein tiefes Figurenmotiv.

## Persistenz und Verifikation

Checkpoints speichern Lumis und Brunos Torstand, Brunos Position und Bewegung, Windschattenbestwert, Falterphase und Abschluss. Automatische Komplettläufe bestanden mit 6/6, 7/7, 8/8 und 9/9 Toren. In allen Läufen waren Windschatten und Falter aktiv, Beute/Fledermäuse/Rivalen blieben bei null, und Bruno wurde ausschließlich nach Level 12 freigeschaltet.
