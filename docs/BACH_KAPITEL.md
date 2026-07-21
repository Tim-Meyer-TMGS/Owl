# Das Lied des Baches – Level 13 bis 16

Das Bachkapitel ersetzt die bisherige Jagd in diesen vier Szenen durch eine lesbare Rhythmusquerung. Wasser, Wind und Klang bilden dabei dieselbe Spielinformation.

## Spielablauf

1. Lumi folgt den Wassertakten in ihrer vorgegebenen Reihenfolge.
2. Ein heller, gefüllter Ring und ein kurzer Ton markieren das sichere Flugfenster.
3. Außerhalb dieses Fensters drückt die Gegenströmung Lumi sanft zurück; sie verliert kein Herz.
4. Zwischen den Querungen sammelt Lumi drei schwebende Vorräte über flachen Steinen.
5. Nach allen Takten und Vorräten endet die Szene am gegenüberliegenden Ufer.

Huuu setzt den nächsten Rhythmus auf seinen sicheren Beginn und lässt Fynn antworten. Die markierten Äste bleiben gefahrlose Rastpunkte und lösen in Level 14 und 16 kurze Gespräche aus.

## Steigerung

| Level | Fenster | Takt | Sicherer Anteil | Schwerpunkt |
|---:|---:|---:|---:|---|
| 13 | 4 | 3,6 s | 58 % | Einführung |
| 14 | 4 | 3,3 s | 54 % | Huuu-Antwort |
| 15 | 5 | 3,0 s | 50 % | Nebel und kürzere Wege |
| 16 | 5 | 2,8 s | 48 % | Wasserfall und Kapitelabschluss |

## Daten und Speicherung

- `data/brook-crossings.json` ist die editierbare Quelle für Fenster, Vorräte, Richtung und Wasserfall.
- `tools/build-levels.ps1` validiert und erzeugt `js/brook-crossings.js`.
- `js/systems/brook.js` enthält ausschließlich Zustands- und Querungslogik.
- Checkpoints speichern Zeit, überquerte Fenster, gesammelte Vorräte und Abschlussstatus.
