# Das verschwundene Glühwürmchen – Level 5 bis 8

Stand: 21. Juli 2026

Kapitel 2 ersetzt die frühere Jagdserie durch eine ruhige Such- und Begleitaufgabe. Lumi liest eine verborgene Lichtspur mit Huuu, findet ein kleines Glühwürmchen und bringt es ohne Zeitdruck zum Duftkräuterfeld.

## Datenmodell

`data/firefly-quests.json` definiert für jedes Level:

- die geordnete Liste vorhandener Huuu-Lichtspurkontexte,
- Name, Fundort und individuelles Blinkmuster des verirrten Glühwürmchens,
- Lage, Radius und Kräuterart des Zielorts,
- Flugtempo sowie Start-, Stopp- und Fortsetzungsabstände.

Der Generator validiert genau Level 5 bis 8, alle Kontextverweise, lückenlose Sequenzen, eindeutige Figuren-IDs und sichere Abstandswerte. Die Laufzeitdaten werden nach `js/firefly-quests.js` geschrieben.

## Ablauf

1. Nur der nächste noch offene Spurabschnitt kann auf Huuu reagieren.
2. Jeder Fund zeichnet weitere Lichtpunkte in die Welt und lädt einen Teil des Huuu-Rufs wieder auf.
3. Nach der vierten Spur wird das verirrte Glühwürmchen sichtbar.
4. Bei vorsichtiger Annäherung folgt es Lumi mit eigenem, deutlich langsamerem Tempo.
5. Wird der Abstand zu groß, bleibt es an seiner aktuellen Position stehen. Es verschwindet nicht und setzt keinen Fortschritt zurück.
6. Sobald Lumi zurückkehrt, setzt es den Flug selbstständig fort.
7. Der Levelabschluss erfolgt erst, wenn beide das Duftkräuterfeld erreichen.

Zufallsbeute, Fledermäuse, Rivalen, Elitegegner und schädliche Zufallshindernisse sind in diesen vier Leveln deaktiviert.

## Darstellung und Klang

- Birkenlandmarken, hohes schwankendes Gras und niedriger Nebel prägen das Kapitel.
- Enthüllte Abschnitte bestehen aus kleinen handgezeichneten Lichtpunkten zwischen den Huuu-Markierungen.
- Funke, Flimmer, Tupf und Mini besitzen unterschiedliche Blinkmuster.
- Das Duftkräuterfeld verwendet je Level eine eigene Kräuterart und leuchtet bei der Ankunft mit der versammelten Familie.
- Spurenthüllung, Fund, Warten und Ankunft besitzen getrennte prozedurale Klangfolgen.
- Das mobile HUD reduziert die Aufgabe auf Huuu-, Licht- und Herzsymbole sowie einen kurzen situationsabhängigen Hinweis.

## Speicherstand

Der bestehende Checkpoint enthält zusätzlich:

- enthüllte Kontext-IDs,
- Fund-, Warte-, Folge- und Ankunftszustand,
- Position und Geschwindigkeit des kleinen Glühwürmchens,
- Anzahl vorübergehender Trennungen.

Ein wartendes Glühwürmchen bleibt damit auch nach Fortsetzen exakt an seinem sicheren Ort.

## Verifikation

- Generator: vier Quests und 16 Lichtspurabschnitte.
- Automatische Komplettläufe für Level 5 bis 8 bestanden.
- Jeder Lauf enthüllte genau 4/4 Abschnitte und endete erst nach der Ankunft im Kräuterfeld.
- Separater Abstandstest: warten, Position bewahren, wieder annähern und weiterfolgen erfolgreich.
- In allen vier Läufen: null Zufallsbeute, null Fledermäuse und null Rivalen.
- Handy-Querformat 740 × 400 und Tablet-Querformat 1366 × 900 visuell geprüft.
- Testzugang, Screenshots und Browserprofil anschließend entfernt.
