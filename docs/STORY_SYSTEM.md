# Story-, Dialog- und Begleitersystem

Stand: 21. Juli 2026

## Architektur

- Kapitelintros, Figuren und Geschenkentscheidung: `data/story.json`
- 30 szenenspezifische Ereignislisten: `data/story-events.json`
- Generierte Laufzeitdaten: `js/story.js` und `js/story-events.js`
- Trigger- und Begleiterlogik: `js/systems/story.js`
- Laufzeitintegration und Darstellung: `js/game.js`

`tools/build-levels.ps1` validiert Kapitel, Sprecher, maximale Introlänge, Triggerarten, Begleiterzustände, eindeutige IDs und die Zuordnung zu allen 30 Leveln. Der aktuelle Bestand umfasst 61 Storyereignisse.

## Dialoge

- Kapitelintros enthalten höchstens vier kurze Karten.
- Intros können übersprungen werden.
- Bereits gesehene Intros werden im Kampagnenfortschritt gespeichert.
- Die Option „Gesehene Kapitelintros erneut zeigen“ steuert Wiederholungen.
- Flugdialoge erscheinen als kompakte Sprechblase außerhalb von Mission und Touchaktionen.
- Jede Figur besitzt eine eigene Farbe, ein gezeichnetes Portrait und ein kurzes Zweitonmotiv.
- Gleichzeitig ausgelöste Flugdialoge landen in einer Warteschlange und überschreiben sich nicht.

## Trigger

| Typ | Bedingung |
|---|---|
| `position` | Lumi hat eine definierte horizontale Weltposition erreicht oder überschritten. |
| `objective` | Der Auftragsfortschritt erreicht einen Prozentwert. |
| `landing` | Ein bestimmter sicherer Ast wurde besucht. |
| `hoot` | Ein bestimmter Huuu-Kontext wurde abgeschlossen. |
| `companionDistance` | Ein Begleiter ist näher oder weiter als der konfigurierte Abstand. |

Ereignisse sind einmalig oder wiederholbar mit Abklingzeit. `requires` bildet bewusste Abhängigkeiten ab, beispielsweise Fynns letzten Sprung erst nach Lumis Ruf. Positionstrigger verwenden eine überschreitbare Schwelle, damit schnelles Durchfliegen sie nicht auslässt.

Abgeschlossene Trigger, Begleiterzustände, Mutwerte und der letzte sichere Punkt werden im Checkpoint gespeichert. Mit Taste `T` lassen sich räumliche Triggerflächen für die Entwicklung ein- und ausblenden.

## Begleiter

Fynn, Bruno und die Glühwürmchen verwenden dieselbe Daten- und Bewegungsbasis. Unterstützte Zustände:

- `follow`: folgt versetzt hinter Lumi
- `wait`: bleibt an seinem Ankerpunkt
- `ahead`: fliegt sichtbar voraus
- `help`: hält eine unterstützende Position nahe Lumi
- `unsure`: folgt vorsichtiger und mit größerem Abstand
- `arrived`: bewegt sich zum Szenenziel

Begleiter kollidieren nicht mit Hindernisgeometrie und werden innerhalb der sicheren Flughöhe gehalten. Bei zu großer Entfernung bewegen sie sich beschleunigt, aber weich zum zuletzt gespeicherten sicheren Punkt. Fynns Mut reagiert langsam auf Nähe, Abstand und gemeinsame Rast.

## Abnahme

Automatisiert geprüft wurden:

- 30 Szenen, 61 Ereignisse und sechs Begleiterzustände
- alle fünf Triggerarten
- abhängige und einmalige Trigger
- Checkpoint-Persistenz für Trigger und Begleiter
- sanfte Rückkehr eines entfernten Begleiters
- gezeichnete Figurenportraits
- höchstens vier Intro-Karten

Sprechblasen, Portraits, Bruno und Glühwürmchen wurden bei 740 × 400 sowie 1366 × 900 visuell geprüft. Mission, Pause, Ton und Touchaktionen bleiben frei bedienbar.
