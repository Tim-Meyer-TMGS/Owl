# Huuu-System

Stand: 20. Juli 2026

## Zweck

Huuu ist eine kontextuelle Storyfähigkeit und kein Flächenschaden. Der Ruf entdeckt, beruhigt, bewegt, orientiert, spricht Figuren an oder drängt Gegner gewaltfrei zurück. Farbe, Symbol, Wellenform, Ton und Antwortquelle zeigen die jeweilige Funktion.

## Daten und Build

- Quelle: `data/hoot-contexts.json`
- Laufzeitspiegel: `js/hoot-contexts.js`
- Validierung und Auswahl: `js/systems/hoot.js`
- Erzeugung: `tools/build-levels.ps1`
- Umfang: 30 Szenen, 71 handgesetzte Interaktionen

Jeder Kontext besitzt mindestens ID, Typ, relative Weltposition, Radius, Symbol, Funktionsfarbe und Audioantwort. Einmalige Kontexte werden im Checkpoint als abgeschlossene IDs gespeichert. Relative Positionen bleiben bei unterschiedlichen Displaygrößen stabil.

## Kontexttypen

| Typ | Wirkung |
|---|---|
| `lightTrail` | Deckt ausschließlich den nächsten Abschnitt einer Spur auf. |
| `hiddenObject` | Öffnet ein Blätterversteck, erzeugt den Fund und speichert gegebenenfalls eine Erinnerung. |
| `calmFireflies` | Verlängert die sichtbare Aktivität der Glühwürmchen. |
| `calmFynn` | Löst Fynns beruhigte, verzögerte Antwort aus. |
| `distantSpeaker` | Ruft Ava, Bruno oder Fynn über größere Entfernung. |
| `leafBurst` | Bewegt gezeichnete Blätter und Samen physisch vom Ruf weg. |
| `fogMarker` | Macht einen farbigen, akustisch beantwortenden Orientierungspunkt sichtbar. |
| `finaleChain` | Löst gestaffelte Antworten von Ava, Bruno, Fynn und dem Waldchor aus. |

Fledermäuse fliehen aus der Rufzone. Rivalen lassen geraubte Beute fallen und werden zurückgestoßen, bleiben aber unverletzt im Spiel.

## Rückmeldung

- Der mobile Huuu-Button und das Desktop-HUD zeigen Ladung, Kontextsymbol und Funktionsbezeichnung.
- Unregelmäßige Doppelwellen ersetzen den technisch wirkenden Standardkreis.
- Funktionsfarben unterscheiden Spur, Fund, Beruhigen, Antwort, Wind, Orientierung, Finale und Vertreiben.
- Antworten treffen abhängig von der Entfernung verzögert ein.
- Stereoposition und eigener Klangcharakter verorten die Quelle akustisch.
- Quellen außerhalb der Kamera werden kurz als farbiger Randzeiger dargestellt.
- Im ersten Tutorial-Level verbraucht ein Ruf ohne Kontext oder Gegner keine Ladung.

## Persistenz

`hootContextIds` im laufenden Checkpoint enthält abgeschlossene einmalige Kontexte. Beim Laden oder Skalieren einer Welt rekonstruiert `js/systems/hoot.js` deren Zustand. Erinnerungsfunde landen zusätzlich im Szenenrekord des Kampagnenfortschritts.

## Abnahmetest

Der instrumentierte Browsertest hat geprüft:

- 30 Szenen und 71 Interaktionen werden geladen.
- Ein falscher Tutorial-Ruf behält die volle Ladung.
- Ein gültiger Kontext wird sichtbar und verbraucht die Ladung.
- Ein Rivale bleibt vorhanden, lässt Beute fallen und erhält Fluchtimpuls.
- Bei einer Lichtspur wird nur das erste offene Segment abgeschlossen.
- Das Finale stellt mindestens vier zeitversetzte Antworten in die Warteschlange.
- Verarbeitete Fernantworten erzeugen Randhinweise.
- Keine Laufzeitfehler im normalen Startzustand.
- Visuelle Prüfung bei 740 × 400 und 1366 × 900.
