# Wiesenprüfung – Level 2 bis 4

Stand: 21. Juli 2026

Die Wiesenprüfung ersetzt in Level 2 bis 4 die bisherige Jagdarena durch ein ruhiges Navigationskapitel. Geprüft werden Orientierung, eine selbst gewählte sichere Fluglinie, das Aufnehmen fester Naturfunde und die sichere Rückkehr zum Nest.

## Datenmodell

`data/meadow-routes.json` ist die maßgebliche Quelle. Jede Szene definiert:

- fortlaufende Routenstufen mit einem oder mehreren Toren je Stufe,
- feste Beeren-, Samen-, Käferflügel- und Kräuterfunde,
- Anzahl benötigter Tore und Funde,
- optional eine Figurenbegegnung,
- ein großzügiges Zeitfenster für die Routenserie.

`tools/build-levels.ps1` validiert Levelbezüge, eindeutige IDs, lückenlose Routenstufen, alle vier Fundarten und die verpflichtende Mausdefinition. Danach erzeugt es `js/meadow-routes.js`.

## Spielregeln

1. Das nächste Routentor leuchtet deutlich. Bei einer geteilten Stufe kann der Spieler einen von zwei sicheren Bögen wählen.
2. Ein durchflogenes Tor erhöht die Routenserie. Beutefänge beeinflussen diese Serie nicht.
3. Naturfunde werden bei Annäherung aufgenommen; ein Sturzflug ist nicht nötig.
4. Jeder Fund wird einzeln zum Nest gebracht. Auf einem Ast kann er nicht versehentlich abgelegt werden.
5. Level 4 verlangt zusätzlich die Begegnung mit Marta Maus.
6. Der Abschluss wird erst ausgelöst, wenn Route, Funde und optionale Begegnung erfüllt sind und Lumi wieder im Nest ist.

Während des Kapitels sind Zufallsbeute, Fledermäuse, Rivalen und schädliche Zufallshindernisse deaktiviert. Büsche, sichere Äste, Glühwürmchen und Bodendetails bleiben als Orientierung und Atmosphäre erhalten.

## Dramaturgie und Darstellung

- Level 2 führt vier leicht lesbare Routenstufen und drei Fundarten ein.
- Level 3 bietet an zwei Stellen alternative Fluglinien und erstmals einen schimmernden Käferflügel.
- Level 4 kombiniert sechs Routenstufen, alle vier Fundtypen und die große, sprechende Marta Maus.
- Blätterbögen bilden die Tore; aktive Tore leuchten, abgeschlossene Alternativen treten zurück.
- Marta besitzt eine eigene Canvas-Figur, ein Mausportrait, Figurenfarbe und ein dreistufiges Audiomotiv.
- Route, Fundaufnahme und Figurenbegegnung haben getrennte prozedurale Klangsignale.

## Speicherstand

Der V1-Checkpoint speichert zusätzlich:

- gewählte und abgeschlossene Tor-IDs,
- aufgenommene und abgelieferte Fund-IDs,
- Routenserie und verbleibendes Serienfenster,
- Marta-Begegnung,
- einen aktuell getragenen Fund.

Damit bleiben alternative Routenwahl, Lieferfortschritt und eine laufende Fundlieferung nach dem Fortsetzen erhalten.

## Verifikation

- Generator: 3 Szenen, 19 Tore, 10 Funde.
- Automatischer Komplettlauf für Level 2, 3 und 4 bestanden.
- Pro Level wurde bei Alternativen genau ein Tor derselben Stufe gewertet.
- Abschlussdialog erschien erst nach vollständiger Route, allen Lieferungen, erforderlicher Begegnung und Nest-Rückkehr.
- In allen drei Läufen: null Zufallsbeute, null Fledermäuse, null Rivalen.
- Querformat visuell bei 740 × 400 und 1366 × 900 geprüft.
- Temporärer Testzugang, Browserprofile und Prüfbilder wurden entfernt.
