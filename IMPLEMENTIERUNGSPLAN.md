# EULENFLUG – vollständiger Implementierungsplan

## Zielbild

EULENFLUG wird von einem arenaartigen Jagdspiel zu einem handillustrierten, horizontal erkundbaren Story-Abenteuer umgebaut. Die Kampagne erzählt in etwa 30 Minuten Lumis Reise für Fynns erstes Flugfest. Die 30 vorhandenen Level werden als kurze Szenen innerhalb von Prolog, sieben Kapiteln und Epilog organisiert.

Die wichtigsten Leitlinien sind:

- Keine generierten oder generativ wirkenden Grafiken.
- Konsistente, manuell erstellte SVG- und Sprite-Grafiken.
- Tiere sind überwiegend Figuren, Helfer und Wegweiser statt anonyme Gegner.
- Fehler führen zu sicheren Ästen oder zum Nest zurück, nicht zum Tod.
- Direkte, einfache Touch-Steuerung ohne Speed-Multiplikator.
- Horizontale Welten mit automatischer Kamera statt einer Browser-Scrollbar im Spiel.
- Eine horizontal wischbare Kapitelkarte außerhalb des Gameplays.
- Kurze Dialoge und sichtbare Handlungen statt langer Textblöcke.
- Story, Grafik, Mechanik und Sound müssen dieselbe warme Tonalität tragen.

---

## Prioritäten

### P0 – Technische und spielerische Grundlage

Diese Punkte müssen zuerst abgeschlossen werden. Ohne sie sollen keine weiteren Kapitel produziert werden.

### P1 – Vollständige Storykampagne

Diese Punkte bilden die vollständige 30-Minuten-Kampagne.

### P2 – Progression, Zusatzinhalte und Feinschliff

Diese Punkte erhöhen Wiederspielwert und Präsentationsqualität, dürfen aber den Abschluss der Kampagne nicht blockieren.

---

# 1. Projektstruktur und technische Basis – P0

## 1.1 Bestehenden Stand sichern

- [x] Aktuellen spielbaren Stand als Referenz markieren.
- [x] Vorhandene Speicherstände, Leveldaten und Eulendaten dokumentieren.
- [x] Bestehende Kernfunktionen identifizieren, die übernommen werden können:
  - Audio-Kontext und Lautstärkeschalter
  - Touch- und Tastatureingaben
  - Huuu-Ladung
  - Partikelsystem
  - Checkpoints und Fortschrittsspeicherung
  - Responsive HUD-Grundlage
- [x] Nicht mehr benötigte Jagd-, Gegner- und Arena-Logik kennzeichnen, aber erst nach erfolgreichem Ersatz entfernen.

## 1.2 JavaScript aufteilen

- [ ] `js/game.js` schrittweise in klar abgegrenzte Dateien überführen.
- [ ] Folgende Struktur anlegen:

```text
js/
  core/
    bootstrap.js
    state.js
    loop.js
    input.js
    camera.js
    audio.js
    save.js
  world/
    world-loader.js
    collision.js
    triggers.js
    wind.js
    perches.js
  actors/
    lumi.js
    fynn.js
    companions.js
    creatures.js
  systems/
    hoot.js
    inventory.js
    objectives.js
    dialogue.js
    progression.js
  render/
    renderer.js
    parallax.js
    sprites.js
    effects.js
  ui/
    hud.js
    chapter-map.js
    story-overlay.js
    results.js
```

- [ ] Abhängigkeiten über einen gemeinsamen `window.OWL`-Namensraum kapseln.
- [x] Spiel weiterhin ohne verpflichtende Paketinstallation startbar halten.
- [ ] Initialisierung nur noch über `bootstrap.js` ausführen.
- [ ] Einen Entwicklungsmodus für Szenenauswahl, Trigger und Kollisionsflächen vorsehen.

## 1.3 Datenquellen erweitern

- [x] `story.json` als zentrale Storyquelle beibehalten.
- [x] Weltdateien unter `data/worlds/` anlegen.
- [x] Jede Szene mit folgenden Kerndaten beschreiben:

```json
{
  "id": "chapter-02-firefly-01",
  "chapter": "firefly",
  "sceneType": "trail_search",
  "worldWidth": 4200,
  "worldHeight": 900,
  "start": { "x": 280, "y": 410 },
  "goal": { "x": 3880, "y": 360 },
  "cameraMode": "follow",
  "safeBranches": [],
  "landmarks": [],
  "storyTriggers": [],
  "objectives": []
}
```

- [ ] Build-Skript um Welt-, Dialog-, Animations- und Asset-Metadaten erweitern.
- [ ] Alle JSON-Dateien beim Build auf Pflichtfelder und doppelte IDs prüfen.

### Abnahmekriterien für Punkt 1

- Das bestehende Spiel startet nach jeder Aufteilung weiterhin fehlerfrei.
- Datenfehler liefern verständliche Meldungen.
- Eine Testszene kann unabhängig von der Kampagne geladen werden.
- Keine temporären Debug-Schalter verbleiben im Produktionscode.

---

# 2. Verbindliche Grafikrichtlinie – P0

## 2.1 Art Bible erstellen

- [x] Eine `ART_BIBLE.md` mit verbindlichen Regeln anlegen.
- [x] Stil festlegen: handillustriertes Bilderbuch mit Siebdruck-/Scherenschnittcharakter.
- [x] Konturstärken für Figuren, Umgebung und Vordergrund definieren.
- [x] Pro Kapitel eine begrenzte Farbpalette mit maximal acht Hauptfarben festlegen.
- [x] Lichtquelle, Schattenrichtung und Nachtkontrast festlegen.
- [x] Größenverhältnisse aller Hauptfiguren dokumentieren.
- [x] Verbotene Gestaltungsmittel dokumentieren:
  - keine generierten Bilder
  - keine fotorealistischen Texturen
  - keine zufälligen Detailmuster auf Figuren
  - keine inkonsistenten Perspektiven
  - keine übermäßigen Neon-Glows
  - keine uneinheitlichen Anatomien

## 2.2 Manuelle Asset-Pipeline

- [ ] Assets in einem festen Raster manuell als SVG zeichnen.
- [ ] Quelldateien und optimierte Laufzeitdateien getrennt halten.
- [ ] Folgende Ordner anlegen:

```text
assets/
  characters/
  creatures/
  environments/
  landmarks/
  props/
  effects/
  ui/
  textures/
  animation-data/
```

- [ ] Feste Papier-, Pinsel- und Körnungstexturen erstellen.
- [ ] Texturen nicht zufällig pro Frame erzeugen.
- [ ] SVGs auf konsistente Pfadrichtung, ViewBox und Farbtokens prüfen.
- [ ] Laufzeit-Assets komprimieren, ohne Quelldateien zu überschreiben.

## 2.3 Charakter-Sheets

- [ ] Lumi zeichnen: schlank, goldbraun, gelbes Halstuch.
- [ ] Fynn zeichnen: kleiner, rundlicher, hellblaues Halstuch.
- [ ] Ava zeichnen: breite ruhige Silhouette, cremefarben.
- [ ] Bruno zeichnen: groß, kantige Flügel, schiefe Brille.
- [ ] Alten Kauz zeichnen: zerzauste Brauen, Moosdetails.
- [ ] Glühwürmchenfamilie mit unterschiedlichen Lichtmustern zeichnen.
- [ ] Für jede Hauptfigur folgende Ansichten anlegen:
  - neutral von links und rechts
  - Vorderansicht
  - Rückansicht
  - sitzend
  - sprechend
  - überrascht
  - fröhlich
  - unsicher

## 2.4 Animationssatz

- [ ] Lumi: Schweben, Flügelschlag, Sturzflug, Bremsen, Landen, Sitzen, Tragen, Huuu, Taumeln und Lachen.
- [ ] Fynn: unsicheres Flattern, Folgen, Landen, Warten und erster Sprung.
- [ ] Bruno: schwerer Flügelschlag, Windschatten, Brille richten und tollpatschiges Bremsen.
- [ ] Richtungswechsel als eigene Animation umsetzen; Figuren dürfen nicht rückwärts gespiegelt laufen oder fliegen.
- [ ] Animationen mit wenigen klaren, von Hand gesetzten Schlüsselbildern erstellen.
- [ ] Kein automatisches Morphing zwischen unpassenden Formen verwenden.

### Abnahmekriterien für Punkt 2

- Jede Hauptfigur ist allein an ihrer Silhouette erkennbar.
- Alle Assets wirken wie aus demselben Bilderbuch.
- Links-/Rechts-Bewegungen besitzen korrekte Blick- und Bewegungsrichtung.
- Bei 740 × 400 bleiben Augen, Halstücher und wichtige Gegenstände lesbar.

---

# 3. Horizontale Welt und Kamera – P0

## 3.1 Weltkoordinaten

- [x] Spiellogik vollständig von Bildschirmkoordinaten auf Weltkoordinaten umstellen.
- [x] Szenenbreiten von etwa drei bis sechs Bildschirmbreiten ermöglichen.
- [x] Objekte nur relativ zur Kamera zeichnen.
- [x] Kollisions- und Triggerpositionen ebenfalls in Weltkoordinaten speichern.
- [x] Offscreen-Objekte nicht zeichnen.

## 3.2 Kamerasystem

- [x] Weiches horizontales Folgen implementieren.
- [x] Eine innere Ruhezone definieren, in der sich die Kamera nicht bewegt.
- [x] Blickvorsprung in Flugrichtung ergänzen.
- [x] Vertikale Kamerabewegung begrenzen, damit Boden und Orientierung sichtbar bleiben.
- [x] Kameramodi ergänzen:
  - `follow`
  - `race`
  - `dialogue`
  - `escort`
  - `cinematic`
- [x] Bei Sturzflug leicht herauszoomen.
- [ ] Beim Landen sanft zur Ruhe kommen.
- [x] Beim Huuu-Ruf kurz den sichtbaren Bereich erweitern.
- [x] Im Fynn-Kapitel Lumi und Fynn gemeinsam im Bild halten.

## 3.3 Parallax und Tiefe

- [x] Fünf feste Tiefenebenen implementieren:
  1. Himmel, Sterne und Mond
  2. entfernte Hügel und Waldsilhouetten
  3. mittlere Baumreihen und Nebel
  4. spielbare Ebene
  5. unscharfer Vordergrund
- [x] Pro Ebene einen eigenen Scrollfaktor verwenden.
- [x] Vordergrundelemente dürfen kurz verdecken, aber keine Missionsobjekte dauerhaft verbergen.
- [ ] Nebel, Licht und Wind nach Kapitel variieren.
- [ ] Wiederholte Elemente durch handgesetzte Varianten ersetzen.

## 3.4 Landmarken und Orientierung

- [x] Jede Szene erhält mindestens zwei unverwechselbare Landmarken.
- [x] Zielrichtung über kleine, iconbasierte Hinweise zeigen.
- [x] Nestposition über einen warmen Lichtkegel erkennbar machen.
- [x] Sichere Äste optisch einheitlich markieren.
- [ ] Optional eine sehr kleine symbolische Weganzeige ergänzen; keine detaillierte Minimap.

### Abnahmekriterien für Punkt 3

- Kamera und Touch-Steuerung beeinflussen sich nicht gegenseitig.
- Kein sichtbares Browser-Scrolling während des Gameplays.
- Keine schwarzen oder leeren Bereiche an Weltgrenzen.
- Figuren bleiben auch bei schnellen Richtungswechseln vollständig sichtbar.
- Tablet-Querformat zeigt mehr Welt, ohne Figuren unlesbar klein zu skalieren.

---

# 4. Horizontale Kapitelkarte – P0

## 4.1 Kartenstruktur

- [x] Separate Levelauswahl als native horizontal scrollbarere Oberfläche bauen.
- [x] Alle 30 Szenen entlang eines gezeichneten Waldpfads positionieren.
- [x] Storyabschnitte visuell gruppieren:
  - Alte Eiche
  - Mondwiese
  - Birkenhain
  - Brunos Baumwipfel
  - Bach und Schlucht
  - Erinnerungswald
  - Windpass
  - Fynns Flugroute
  - Fest im Mondlicht
- [x] Große Landmarken als Kapitelgrenzen verwenden.
- [x] Beim Öffnen automatisch zum zuletzt freigeschalteten Punkt scrollen.

## 4.2 Interaktion

- [x] Wischen scrollt die Karte.
- [x] Antippen eines freigeschalteten Punkts öffnet dessen kompakte Vorschau.
- [x] Gesperrte Szenen zeigen nur Voraussetzung und Symbol.
- [x] Erreichte Ziele über Symbole statt lange Sätze anzeigen.
- [x] Pro Szene anzeigen:
  - abgeschlossen
  - Bonusziel
  - Erinnerungsfund
  - bester Punktestand
  - verwendete Figur
- [x] Kapitelstart und Finale deutlich größer darstellen.

### Abnahmekriterien für Punkt 4

- Die Karte lässt sich auf kleinen Handys mit einem Finger bedienen.
- Kartenscrollen löst keine Spielsteuerung aus.
- Der aktuelle Fortschritt ist ohne Erklärung verständlich.
- Die Reise wirkt wie ein zusammenhängender Weg und nicht wie eine Tabellenansicht.

---

# 5. Neue Flug- und Landemechanik – P0

## 5.1 Direktsteuerung

- [x] Fingerzielsteuerung als Hauptsteuerung beibehalten.
- [x] Zielpunkt oberhalb des Fingers darstellen, damit Lumi sichtbar bleibt.
- [x] Beschleunigung und Bremsweg pro Figur fest definieren.
- [x] Keine Upgrade-basierten Änderungen der Lenkempfindlichkeit.
- [x] Tastatursteuerung gleichwertig erhalten.

## 5.2 Landen

- [x] Äste mit großzügigen unsichtbaren Landezonen ausstatten.
- [x] Antippen eines nahen Asts löst automatischen Landeanflug aus.
- [x] Landung kann durch erneutes Lenken abgebrochen werden.
- [x] Auf Ästen Ausdauer ruhig regenerieren.
- [ ] Dialoge und Beobachtungsaktionen primär im Sitzen auslösen.
- [x] Sichere Äste als Checkpoints speichern.

## 5.3 Sturzflug

- [x] Sturzflug als kurze, klar animierte Aktion behalten.
- [ ] Einsatz für schnelle Richtungswechsel, Rennen und Windpassagen verwenden.
- [ ] Sturzflug nicht zum Angriff auf freundliche Tiere verwenden.
- [x] Kollisionen führen zu Taumeln oder einer weichen Buschlandung.

## 5.4 Tragen

- [x] Kleine Gegenstände ohne Einschränkung tragen.
- [x] Große Gegenstände senken nur Auftrieb und Bremsvermögen, nicht die Lenkempfindlichkeit.
- [x] Getragene Gegenstände sichtbar und typgerecht darstellen.
- [x] Ablegen auf markierten Ästen und im Nest ermöglichen.

### Abnahmekriterien für Punkt 5

- Ein neuer Spieler kann innerhalb von 30 Sekunden fliegen und landen.
- Keine Figur bewegt sich rückwärts.
- Landen funktioniert zuverlässig auf kleinen Touchscreens.
- Fehler wirken humorvoll und nicht bestrafend.

---

# 6. Huuu als kontextuelle Kernfähigkeit – P0

## 6.1 Grundsystem

- [x] Eigene Huuu-Ladung beibehalten.
- [x] Reichweite und verfügbarer Kontext über visuelle Symbole anzeigen.
- [x] Huuu-Effekt über handgezeichnete Wellen und verzögerte Umweltantwort darstellen.
- [x] Unterschiedliche akustische Antworten je Kontext verwenden.

## 6.2 Kontextaktionen

- [x] Verlorene Lichtspuren aufdecken.
- [x] Versteckte Gegenstände unter Blättern markieren.
- [x] Glühwürmchen und Fynn beruhigen.
- [x] Entfernte Figuren ansprechen.
- [x] Leichte Blätter und Samen bewegen.
- [x] Rivalen zurückdrängen, ohne sie zu verletzen.
- [x] Im Nebel Orientierungspunkte hör- und sichtbar machen.
- [x] Im Finale eine Antwortkette aller Figuren auslösen.

## 6.3 Rückmeldung

- [x] Farbe der Rufwelle nach Funktion variieren.
- [x] Antwortquelle am Bildschirmrand anzeigen, wenn sie außerhalb der Kamera liegt.
- [x] Huuu nicht verbrauchen, wenn im Tutorial ein falscher Kontext getroffen wurde.
- [x] Ladezustand am mobilen Button und im Desktop-HUD zeigen.

### Abnahmekriterien für Punkt 6

- Spieler erkennen ohne Text, ob der Ruf etwas gefunden, beruhigt oder zurückgedrängt hat.
- Der Ruf ist nie nur ein generischer Flächenschaden.
- Audioantworten lassen sich auch ohne Blick auf die Quelle räumlich zuordnen.

---

# 7. Story-, Dialog- und Begleitersystem – P0

## 7.1 Dialogdarstellung

- [ ] Kapitelintro mit maximal vier kurzen Dialogkarten.
- [ ] Gespräche während des Flugs als kompakte Sprechblasen anzeigen.
- [ ] Sprechblasen dürfen Steuerung und Missionsobjekte nicht verdecken.
- [ ] Sprecher über Farbe, Portrait und individuelles Klangmotiv kennzeichnen.
- [ ] Dialoge überspringbar machen.
- [ ] Bereits gesehene Kapitelintros im Wiederholungsmodus optional ausblenden.

## 7.2 Storytrigger

- [ ] Trigger nach Weltposition, Zielstatus, Landung, Huuu und Begleiterabstand unterstützen.
- [ ] Trigger nur einmal oder bewusst wiederholbar konfigurieren.
- [ ] Storytrigger im Checkpoint speichern.
- [ ] Entwickleranzeige für Triggerflächen bauen.

## 7.3 Begleiter

- [ ] Gemeinsame Begleiterbasis für Fynn, Bruno und Glühwürmchen bauen.
- [ ] Zustände unterstützen:
  - folgen
  - warten
  - vorausfliegen
  - helfen
  - unsicher
  - Ziel erreicht
- [ ] Begleiter dürfen nicht an Weltgeometrie hängen bleiben.
- [ ] Begleiter bei großem Abstand sanft an den letzten sicheren Punkt zurücksetzen.

### Abnahmekriterien für Punkt 7

- Storyfortschritt kann nicht durch schnelles Durchfliegen übersprungen oder blockiert werden.
- Dialoge sind im Handy-Querformat vollständig lesbar.
- Begleiter bleiben sichtbar und verhalten sich vorhersehbar.

---

# 8. Kapitelproduktion – P1

## 8.1 Prolog – Level 1

- [ ] Ruhige Nestszene mit Ava, Lumi und Fynn bauen.
- [ ] Fynns missglückte Balanceanimation umsetzen.
- [ ] Windstoß und verstreute Vorräte als Kamerafahrt zeigen.
- [ ] Fliegen, Landen, Tragen und Huuu einzeln erklären.
- [ ] Drei einfache Vorratspäckchen sammeln lassen.

## 8.2 Kapitel 1: Die Wiesenprüfung – Level 2 bis 4

- [ ] Mondwiese mit breiten, sicheren Flugräumen erstellen.
- [ ] Beeren, Samen, Käferfunde und Kräuter verteilen.
- [ ] Routen-Komبو statt Jagd-Komبو umsetzen.
- [ ] Große sprechende Maus als humorvolle Begegnung inszenieren.
- [ ] Kapitel mit Rückkehr zum Nest abschließen.

## 8.3 Kapitel 2: Das verschwundene Glühwürmchen – Level 5 bis 8

- [ ] Birkenhain und hohes Gras erstellen.
- [ ] Lichtspur-System implementieren.
- [ ] Huuu deckt jeweils nur den nächsten Spurabschnitt auf.
- [ ] Verlorenes Glühwürmchen suchen und langsam begleiten.
- [ ] Zu großer Abstand stoppt das Glühwürmchen, verursacht aber keinen Verlust.
- [ ] Duftkräuterfeld als Belohnungsort gestalten.

## 8.4 Kapitel 3: Der große Konkurrent – Level 9 bis 12

- [ ] Bruno mit eigenem Intro und Brillenanimation einführen.
- [ ] Horizontales Wettrennen durch handgesetzte Flugtore bauen.
- [ ] Windschattenmechanik implementieren.
- [ ] Nachtfalter als bewegliches Ziel inszenieren.
- [ ] Wettkampf ohne Schaden oder Beutediebstahl gestalten.
- [ ] Bruno anschließend als Verbündeten freischalten.

## 8.5 Kapitel 4: Das Lied des Baches – Level 13 bis 16

- [ ] Bach, Wasserfall und Schlucht als zusammenhängende Welt bauen.
- [ ] Wasser- und Windrhythmus synchronisieren.
- [ ] Sichere Flugfenster visuell und akustisch ankündigen.
- [ ] Schwebende Vorräte zwischen Steinen einsammeln.
- [ ] Sichere Äste als kurze Rast- und Gesprächspunkte verwenden.
- [ ] Lumis ehrliches Gespräch über Nervosität einbauen.

## 8.6 Kapitel 5: Das Geschenk des Waldes – Level 17 bis 20

- [ ] Punkteanzeige für diese Beobachtungsszenen ausblenden.
- [ ] Vier kleine Suchaufgaben bauen:
  - Feder aus Dornen lösen
  - Stein über Spiegelung entdecken
  - rundes Blatt erkennen
  - Eichenzweig finden
- [ ] Alten Kauz als humorvollen Hinweisgeber einsetzen.
- [ ] Geschenkentscheidung speichern.
- [ ] Gewähltes Geschenk später sichtbar im Nest und Finale zeigen.

## 8.7 Kapitel 6: Der Wind dreht sich – Level 21 bis 24

- [ ] Breiten Windpass mit mehreren Höhenrouten bauen.
- [ ] Glühwürmchen markieren sichere Strömungen.
- [ ] Bruno erzeugt temporären Windschatten.
- [ ] Kauz markiert Richtungen, teilweise humorvoll ungenau.
- [ ] Huuu koordiniert Helfer.
- [ ] Alle bisherigen Mechaniken kombinieren, ohne neue Steuerung einzuführen.

## 8.8 Kapitel 7: Fynns erster Flug – Level 25 bis 29

- [ ] Fynn als echten Begleiter statt rein visueller Figur implementieren.
- [ ] Mut-Anzeige ergänzen.
- [ ] Nähe, Warten und sichere Landungen erhöhen Mut.
- [ ] Zu großer Abstand senkt Mut langsam, führt aber nicht zum Scheitern.
- [ ] Kurze Flüge von Ast zu Ast aufbauen.
- [ ] Letzten Sprung erst nach Lumis Huuu und bewusstem Warten auslösen.
- [ ] Fynns Landung mit „Das war Absicht“ abschließen.

## 8.9 Epilog – Level 30

- [ ] Alle Hauptfiguren sichtbar um das Nest platzieren.
- [ ] Gesammelte Vorräte sichtbar aufbauen.
- [ ] Spieler Festobjekte selbst anordnen lassen.
- [ ] Gewähltes Geschenk neben Fynn platzieren.
- [ ] Abschlussdialog umsetzen.
- [ ] Gemeinsamen Huuu-Ruf interaktiv auslösen.
- [ ] Langsame Kamerafahrt über den friedlichen Wald bauen.
- [ ] Abschlusstafel zeigen: „Mut beginnt manchmal mit einem einzigen Flügelschlag.“

### Abnahmekriterien für Punkt 8

- Jede Szene besitzt ein eigenes Ziel und mindestens eine erkennbare Landmarke.
- Kein Kapitel besteht nur aus einer höheren Sammelzahl.
- Gesamtdauer liegt bei etwa 25 bis 35 Minuten.
- Das Finale funktioniert mit jeder Geschenkentscheidung.

---

# 9. Progression und Wiederspielwert – P2

## 9.1 Storyfortschritt

- [ ] Abgeschlossene Szenen und Kapitel speichern.
- [x] Kapitelkarte schrittweise freischalten.
- [x] Unterbrechung an jedem sicheren Ast ermöglichen.
- [x] Fortsetzen direkt an der richtigen Szene und am richtigen Ast ermöglichen.

## 9.2 Erinnerungsalbum

- [ ] Albumseiten pro Kapitel erstellen.
- [ ] Freundschaftssymbole für Hilfsaufgaben vergeben.
- [ ] Gewähltes Geschenk und wichtige Entscheidungen festhalten.
- [ ] Ungefundene Erinnerungen als klare Silhouetten zeigen.

## 9.3 Belohnungen

- [ ] Gefiedervarianten für Lumi freischalten.
- [ ] Alternative Huuu-Harmonien freischalten.
- [ ] Nest- und Festdekorationen freischalten.
- [ ] Permanente Leistungs-Upgrades aus der Storybalance heraushalten.
- [ ] Bestehende Eulenauswahl in einen separaten freien Flug-/Herausforderungsmodus verschieben.

### Abnahmekriterien für Punkt 9

- Die Story bleibt ohne Grind vollständig spielbar.
- Belohnungen verändern hauptsächlich Darstellung und Klang.
- Spieler können Kapitel wiederholen, ohne ihren Hauptfortschritt zu verlieren.

---

# 10. Neues Sound- und Musikdesign – P1

## 10.1 Akustische Stilregeln

- [ ] Warme, kleine Instrumentierung festlegen:
  - Kalimba
  - Holzblock
  - weiche Flöte
  - gestrichene Gläser
  - dezente Streicherflächen
  - handgemachte Raschel- und Flügelfoleys
- [ ] Keine aggressiven Treffer- oder Horrorklänge verwenden.
- [ ] Pro Figur ein kurzes musikalisches Motiv definieren.

## 10.2 Räumlicher Klang

- [ ] Geräusche horizontal positionieren.
- [ ] Entfernung über Lautstärke und Filter darstellen.
- [ ] Offscreen-Huuu-Antworten zur Orientierung verwenden.
- [ ] Wasser, Wind, Blätter und Glühwürmchen als getrennte Umgebungsgruppen mischen.

## 10.3 Kapitelklänge

- [ ] Prolog: alte Eiche, ruhiger Wind, Nestgeräusche.
- [ ] Wiese: Insekten, weiches Gras, leichte Rhythmik.
- [ ] Birkenhain: Glöckchen und wandernde Lichtmotive.
- [ ] Bruno: tiefe Holzbläser und komische Brillenakzente.
- [ ] Bach: rhythmisches Wasser als Gameplay-Takt.
- [ ] Geschenk: reduzierte, neugierige Klangfläche.
- [ ] Windpass: zunehmende, aber nicht bedrohliche Dynamik.
- [ ] Fynns Flug: Lumis und Fynns Motive verschmelzen.
- [ ] Epilog: Motive aller Figuren antworten auf den letzten Huuu-Ruf.

### Abnahmekriterien für Punkt 10

- Jede wichtige Aktion besitzt einen unverwechselbaren Klang.
- Kapitel sind allein über ihre Atmosphäre unterscheidbar.
- Spiel bleibt auch ohne Musik akustisch verständlich.
- Stummschaltung stoppt alle Audioquellen zuverlässig.

---

# 11. UI, Lesbarkeit und Barrierefreiheit – P1

- [ ] HUD nur mit aktuell benötigten Informationen anzeigen.
- [ ] Storyszenen ohne Punkte-HUD darstellen, wenn Punkte keine Bedeutung haben.
- [ ] Große Touchziele mit mindestens 48 CSS-Pixeln verwenden.
- [ ] Dialogschrift bei 740 × 400 ohne Zoomen lesbar halten.
- [ ] Untertitel für alle charakterrelevanten Rufe und Geräusche anbieten.
- [ ] Reduzierte Bewegung respektieren.
- [ ] Bildschirmzittern deaktivierbar machen.
- [ ] Farbunterschiede zusätzlich durch Form und Symbol absichern.
- [ ] Hochkontrastmodus für Missionsobjekte anbieten.
- [ ] Steuerungshilfe jederzeit aus der Pause erreichbar machen.

---

# 12. Speicherstände und Migration – P1

- [ ] Speicherformat auf Version 2 erhöhen.
- [ ] Folgende Daten speichern:
  - aktuelle Szene
  - letzter sicherer Ast
  - abgeschlossene Trigger
  - Kapitelstatus
  - Geschenkentscheidung
  - Erinnerungsfunde
  - freigeschaltete Kosmetik
  - Audio- und Bedienoptionen
- [ ] Bestehende Version-1-Spielstände sicher migrieren.
- [ ] Ungültige oder veraltete Felder mit Standardwerten ergänzen.
- [ ] Niemals einen beschädigten Spielstand ungeprüft laden.
- [ ] Neue Jagd und Story fortsetzen klar trennen.

---

# 13. Performance und technische Qualität – P1

- [ ] Nur sichtbare Weltobjekte rendern.
- [ ] SVGs und Sprites vor Spielbeginn cachen.
- [ ] Geräuschpuffer wiederverwenden.
- [ ] Device-Pixel-Ratio weiterhin begrenzen.
- [ ] Partikelanzahl abhängig von Geräteleistung skalieren.
- [ ] Keine neuen Objekte pro Frame erzeugen, wenn Wiederverwendung möglich ist.
- [ ] Kamera- und Physikberechnung unabhängig von Bildrate halten.
- [ ] Ladeindikator zwischen Kapiteln ergänzen.
- [ ] Fehlende Assets mit verständlichem Platzhalter melden.

Zielwerte:

- 60 FPS auf aktuellen Tablets und Mittelklasse-Handys.
- Mindestens stabile 30 FPS auf älteren Mobilgeräten.
- Keine sichtbaren Nachladeruckler beim ersten Huuu oder Dialog.
- Keine dauerhaft wachsenden Arrays oder Audioquellen.

---

# 14. Testplan – P0 bis P2

## 14.1 Automatisierte Prüfungen

- [ ] JSON-Schema und Levelabdeckung prüfen.
- [ ] Doppelte IDs erkennen.
- [ ] Alle DOM-Referenzen prüfen.
- [ ] Storytrigger auf erreichbare Bedingungen prüfen.
- [ ] Speicherstand-Migration testen.
- [ ] Szenenstart, Checkpoint und Kapitelabschluss testen.
- [ ] Sicherstellen, dass keine Testschalter im Produktionscode verbleiben.

## 14.2 Zielgeräte

- [ ] Kleines Handy quer: 740 × 400.
- [ ] Breites Handy quer: 844 × 390.
- [ ] Großes Handy quer: 932 × 430.
- [ ] Tablet quer: 1280 × 800.
- [ ] Galaxy-Tab-Klasse quer: 1366 × 900.
- [ ] Tablet hoch als unterstützter Fallback.
- [ ] Desktop mit Tastatur.
- [ ] Desktop/DeX mit Maus.

## 14.3 Spieltests

- [ ] Neuer Spieler versteht Flug und Landung ohne Erklärung von außen.
- [ ] Alle Sammel- und Hilfsobjekte sind visuell erkennbar.
- [ ] Keine Pflichtdialoge verdecken Gefahren oder Steuerung.
- [ ] Fynn kann nicht dauerhaft verloren gehen.
- [ ] Jeder Fehler führt zu einem klaren, sicheren Wiederanlauf.
- [ ] Alle vier Geschenke erscheinen korrekt im Finale.
- [ ] Kampagne ist ohne Upgrade-Grind abschließbar.
- [ ] Gesamtdauer mit neuen Spielern messen.

---

# 15. Empfohlene Umsetzungsreihenfolge

## Meilenstein 1 – Vertical Slice

- [ ] Projektstruktur aufteilen.
- [x] Art Bible erstellen.
- [ ] Lumi, Fynn und Ava als finale SVG-Charaktere zeichnen.
- [x] Horizontale Kamera und Parallax-System bauen.
- [x] Landemechanik und sichere Äste implementieren.
- [ ] Prolog und erstes Wiesenlevel vollständig neu bauen.
- [ ] Auf Handy und Tablet testen.

**Entscheidungspunkt:** Erst fortfahren, wenn Grafikstil, Fluggefühl, Kamera und Lesbarkeit gemeinsam überzeugen.

## Meilenstein 2 – Kernsysteme

- [x] Kontextabhängigen Huuu-Ruf fertigstellen.
- [ ] Dialog- und Triggersystem fertigstellen.
- [ ] Begleitersystem fertigstellen.
- [x] Horizontale Kapitelkarte bauen.
- [ ] Speicherformat Version 2 einführen.

## Meilenstein 3 – Mittlere Kapitel

- [ ] Mondwiese abschließen.
- [ ] Glühwürmchen-Kapitel abschließen.
- [ ] Bruno-Rennen abschließen.
- [ ] Bach-Kapitel abschließen.

## Meilenstein 4 – Finale Kapitel

- [ ] Geschenk-Kapitel abschließen.
- [ ] Windpass abschließen.
- [ ] Fynns ersten Flug abschließen.
- [ ] Epilog und Abschlussruf abschließen.

## Meilenstein 5 – Progression und Veröffentlichung

- [ ] Erinnerungsalbum ergänzen.
- [ ] Kosmetische Belohnungen ergänzen.
- [ ] Audio final mischen.
- [ ] Performance optimieren.
- [ ] Vollständigen Geräte- und Spieldurchlauf durchführen.
- [ ] Alte, nicht mehr verwendete Arena-Logik entfernen.

---

# 16. Definition of Done

Die vollständige Implementierung gilt erst als abgeschlossen, wenn:

- [ ] alle 30 Szenen erreichbar und abschließbar sind;
- [ ] alle Storykapitel ohne Platzhalter funktionieren;
- [ ] sämtliche sichtbaren Hauptgrafiken manuell erstellt und stilistisch geprüft wurden;
- [ ] keine generierten Bildassets verwendet werden;
- [ ] Lumi, Fynn, Ava, Bruno und der Kauz vollständige Animationssätze besitzen;
- [ ] Kamera, Touch-Steuerung und Landung auf allen Zielgeräten funktionieren;
- [ ] Huuu in jedem Kapitel eine nachvollziehbare Storyfunktion besitzt;
- [x] Fehler niemals zu Tod oder vollständigem Fortschrittsverlust führen;
- [x] Checkpoints nach Neustart korrekt geladen werden;
- [ ] alle Geschenkvarianten im Finale sichtbar sind;
- [ ] der letzte Huuu-Ruf eine vollständige audiovisuelle Schlusssequenz auslöst;
- [ ] die Kampagne in etwa 25 bis 35 Minuten abgeschlossen werden kann;
- [ ] keine Debug-Hooks, fehlenden Assets oder bekannten Blocker verbleiben.
