# Prolog – Die verlorenen Vorräte

Stand: 21. Juli 2026

## Ziel

Level 1 ist kein reguläres Sammellevel mehr. Der Prolog führt die Kernsteuerung ohne Zeitdruck, Gegner oder zufällige Beute ein. Erst nach allen Lernschritten und drei zurückgebrachten Vorratspäckchen wird der Levelabschluss freigegeben.

## Daten

- Levelregeln: `data/levels.json`
- Welt und sichere Äste: `data/worlds/scenes.json`
- Dialogereignisse: `data/story-events.json`
- Lernschritte und Päckchenpositionen: `data/tutorial.json`
- Laufzeitlogik: `js/systems/tutorial.js`

Der Build verlangt genau drei eindeutige Päckchen und validiert alle Lernschritte, Astreferenzen, Huuu-Kontexte sowie verwendeten Bedingungstypen.

## Inszenierung

Nach dem Kapitelintro beginnt eine 4,6 Sekunden lange Kamerafahrt:

1. Ava, Lumi, Fynn und die hungrigen Eulenkinder sind am Nest sichtbar.
2. Fynn schwankt auf dem Ast und fängt sich wieder.
3. Eine Böe bewegt gezeichnete Blätter und Samen.
4. Die Kamera folgt der Verteilung der drei Päckchen über die horizontale Wiese.
5. Die Kamera kehrt weich zu Lumi zurück.

Während der Kamerafahrt sind Flugaktionen gesperrt. Zeit, Gegner und Spawner laufen nicht weiter.

## Lernfolge

| Schritt | Abschlussbedingung |
|---:|---|
| 1. Fliegen | Lumi entfernt sich ausreichend vom Ausgangspunkt. |
| 2. Landen | Lumi landet auf dem ersten hell markierten sicheren Ast. |
| 3. Aufheben | Ein Vorratspäckchen wird im Sturzflug aufgenommen. |
| 4. Nest | Das erste Päckchen wird im Nest abgeliefert. |
| 5. Huuu | Der Blätterhaufen antwortet auf Lumis Ruf. |
| 6. Vorräte | Alle drei Päckchen sind im Nest. |

Das HUD zeigt immer nur den aktuellen Schritt. Auf kleinen Bildschirmen wird dafür hauptsächlich ein Symbol verwendet. Sturzflug- und Huuu-Schaltfläche pulsieren nur während ihres jeweiligen Lernschritts. Ein vorzeitig ausgelöstes Huuu verbraucht keine Ladung.

## Balance

- kein Zeitverlust
- keine Fledermäuse, Rivalen oder zufälligen Hindernisse
- keine zufälligen Beutespawns
- drei feste, gut erkennbare Päckchen
- sichere Äste bleiben Rast- und Speicherpunkte
- drei Sturzflüge passen in die anfängliche Ausdauer
- Levelabschluss erst nach Lernfolge und Päckchenziel

## Speichern

Checkpointdaten enthalten abgeschlossene Lernschritte und bereits abgelieferte Päckchen-IDs. Nicht abgelieferte Päckchen werden nach dem Laden erneut an ihrer festen Weltposition erzeugt. Alte Checkpoints ohne Tutorialfelder beginnen mit sicheren Standardwerten.

## Abnahme

Der Browserablauf bestätigte:

- drei Päckchen, null Gegner, null zufällige Hindernisse und null Zeitverbrauch
- Kamerafahrt und Windstoß vollständig beendet
- alle sechs Schritte in der vorgesehenen Reihenfolge abgeschlossen
- vorzeitiges Huuu ohne Ladungsverlust
- Levelabschluss erst bei drei Päckchen und vollständigem Tutorial
- vollständige Tutorialpersistenz im Checkpoint
- visuelle Prüfung bei 740 × 400 und 1366 × 900
