# EULENFLUG – technischer Bestand und Migrationsgrenzen

Stand: 21. Juli 2026

Dieses Dokument markiert den spielbaren Ausgangsstand für den schrittweisen Umbau. Es verhindert, dass funktionierende Kernsysteme versehentlich zusammen mit der alten Arenaarchitektur entfernt werden.

## Datenquellen

| Quelle | Laufzeitspiegel | Inhalt | Format |
|---|---|---|---:|
| `data/levels.json` | `js/levels.js` | 30 Level, Population, Ziele, Gefahren und Audioakkorde | 1 |
| `data/owls.json` | `js/owls.js` | sechs spielbare Eulen, Werte, Farben und Freischaltungen | 1 |
| `data/story.json` | `js/story.js` | Prolog, sieben Kapitel, Epilog, Dialoge und Geschenke | 1 |
| `data/worlds/scenes.json` | `js/worlds.js` | 30 horizontale Welten, Kamera, Start/Ziel, Nest, Äste und Landmarken | 1 |
| `data/hoot-contexts.json` | `js/hoot-contexts.js` | 30 Szenen mit 71 handgesetzten Rufkontexten und Audioantworten | 1 |
| `data/story-events.json` | `js/story-events.js` | 30 Szenen mit 61 Storytriggern und Begleiterdefinitionen | 1 |
| `data/tutorial.json` | `js/tutorial.js` | sechs Prologschritte, drei feste Vorratspäckchen und Kamerazeiten | 1 |
| `data/meadow-routes.json` | `js/meadow-routes.js` | Level 2 bis 4 mit 19 Routentoren, 10 Naturfunden und Marta-Begegnung | 1 |
| `data/firefly-quests.json` | `js/firefly-quests.js` | Level 5 bis 8 mit 16 Lichtspuren, vier Begleitfiguren und Kräuterfeldern | 1 |

Die JavaScript-Spiegel werden ausschließlich mit `tools/build-levels.ps1` erzeugt. Die JSON-Dateien sind die Quellen.

## Speicherstände

### Kampagnenfortschritt

Local-Storage-Schlüssel: `owl-flight-progress-v1`

- Spielerlevel und XP
- goldene Upgradepunkte
- gewählte Eule sowie Eulen- und Nestupgrade
- höchste freigeschaltete Szene
- abgeschlossene Szenen
- Szenenrekorde mit Bestwert, Bonus, Erinnerungsstatus, Eule und Abschlusszeit
- gesehene Kapitelintros und Wiederholungseinstellung

Neue Felder besitzen Fallbacks; vorhandene V1-Spielstände bleiben lesbar.

### Laufender Checkpoint

Local-Storage-Schlüssel: `owl-flight-checkpoint-v1`

- aktuelle Szene und Auftragsfortschritt
- Punkte, Herzen, Energie und verbleibende Nacht
- Bonusziel, Fänge und Storyzustand
- Huuu-Ladung und gewähltes Geschenk
- aktuelle Weltposition, Flugzustand und sichere Ast-ID der Eule
- bereits besuchte sichere Äste
- bereits abgeschlossene einmalige Huuu-Kontexte
- abgeschlossene Storytrigger, Begleiterzustände, Mutwerte und letzter sicherer Punkt
- abgeschlossene Prologschritte und abgelieferte Vorratspäckchen
- gewählte Wiesentore, Fundzustände, Routenserie, Marta-Begegnung und aktuell getragener Fund
- enthüllte Lichtspuren, Glühwürmchenzustand, Position, Geschwindigkeit und Trennungszähler

Ältere Checkpoints ohne Weltposition laden weiterhin am Nest. Checkpoints ohne Astzustand starten normal im Flug.

## Übernommene Kernsysteme

Diese Systeme bleiben während des Umbaus funktionsfähig:

- Audio-Kontext, prozedurale Effekte und Lautstärkeschalter
- direkte Touch- und Tastatureingabe
- Huuu-Ladung, Radiuswirkung und akustische Rückmeldung
- Partikel, Ringe und schwebende Rückmeldungen
- Checkpoints und Kampagnenfortschritt
- responsives, iconbasiertes HUD
- Tiere, Rivalen, Büsche und sichere Nestzone als vorläufiger Vertical-Slice-Inhalt

## Ersetzte Arenaannahmen

Folgende Annahmen wurden am 20. Juli 2026 ersetzt:

- Canvasbreite als Weltbreite
- Bildschirmkante als Spawn- und Kollisionsgrenze
- feste Nestposition relativ zum Bildschirm
- Touchkoordinaten direkt als Weltkoordinaten
- ein gemeinsamer, unbewegter Hintergrund
- Zeichnen sämtlicher Objekte unabhängig vom Kameraausschnitt

## Noch zur Entfernung beziehungsweise Ablösung markiert

- die nicht mehr aufgerufenen Funktionen `drawTerrainBackdrop`, `drawDistantTree` und `drawBackground` in `js/game.js`
- wellenbasierte Arenaformulierungen und langfristig das Wellenmodell selbst
- zufällige Hindernisverteilung zugunsten vollständig handgesetzter Weltobjekte
- Canvas-Pfadfiguren zugunsten finaler, manuell erstellter SVG-Charaktere
- Speicherformat V1 nach Einführung und Migration auf Version 2

Diese Teile werden erst entfernt, wenn ihr jeweiliger Ersatz in einer spielbaren Szene geprüft wurde.

## Modulgrenzen des aktuellen Zwischenstands

- `js/core/namespace.js`: gemeinsamer `window.OWL`-Namensraum
- `js/core/camera.js`: Kamera, Modi, Ruhezone, Look-ahead und Zoom
- `js/world/world-loader.js`: Validierung und Skalierung der Weltdaten
- `js/world/perches.js`: Touch-Landezonen, Astsuche und Landeanflug
- `js/systems/hoot.js`: Kontextvalidierung, Priorisierung, Sequenzen und Funktionsstile des Huuu-Rufs
- `js/systems/story.js`: fünf Triggerarten, Ereignisabhängigkeiten und gemeinsame Begleiterbewegung
- `js/systems/tutorial.js`: geordnete Prologschritte und feste Päckchenzustände
- `js/systems/meadow.js`: Routenwahl, Serienfenster, feste Naturfunde, Mausbegegnung und Abschlussprüfung
- `js/systems/firefly-quest.js`: sequenzielle Spurensuche, langsame Begleitung, verlustfreies Warten und Kräuterfeld-Ankunft
- `js/render/parallax.js`: fünf visuelle Tiefenebenen und Landmarken
- `js/ui/chapter-map.js`: horizontale Kapitelkarte
- `js/game.js`: verbleibende Spiellogik und Übergangs-Renderer

Das Projekt bleibt ohne Paketinstallation direkt im Browser startbar.
