# EULENFLUG – Implementierungslog

Dieses Log ergänzt den `IMPLEMENTIERUNGSPLAN.md`. Abgehakt wird nur, was im Projekt vorhanden und geprüft ist. Teilumsetzungen bleiben im Masterplan offen.

## 20. Juli 2026 – P0-Paket 1: Grafikregeln und Kapitelkarte

### Umgesetzt

1. Verbindliche Art Bible angelegt
   - Bilderbuch-, Siebdruck- und Scherenschnittstil festgeschrieben.
   - Konturstärken, Größenverhältnisse, Lichtquelle und Nachtkontrast definiert.
   - Für Prolog, sieben Kapitel und Epilog jeweils eine Palette mit acht Hauptfarben festgelegt.
   - Regeln für Figurenrichtung, Schlüsselbildanimation, Icons, Texturen und mobile Mindestgrößen ergänzt.
   - Generierte Bilder, fotorealistische Texturen, Emoji-Spielgrafik, automatische Morphs und weitere Ursachen eines uneinheitlichen „KI-Looks“ ausdrücklich ausgeschlossen.
   - Manuelle SVG-Pipeline und siebenstufige Assetprüfung dokumentiert.

2. Assetbereich vorbereitet
   - `assets/README.md` trennt editierbare Quellen von geprüften Laufzeitdateien.
   - Noch nicht vorhandene Figuren- oder Texturdateien werden nicht als erledigt ausgewiesen.

3. Horizontale Kapitelkarte als eigenes UI-Modul gebaut
   - Neues Modul `js/ui/chapter-map.js` liest die vorhandenen Level- und Storydaten direkt ein.
   - Alle 30 Szenen werden automatisch in Prolog, sieben Kapitel und Epilog gruppiert.
   - Der Waldpfad ist nativ horizontal scrollbar, touchfähig und verwendet Scroll-Snap.
   - Handgesetzte CSS-Formen bilden Pfad, Berge, Bäume und Kapitelgrenzen; es werden keine generierten oder externen Grafiken verwendet.
   - Kapitelstart und Finale besitzen größere Kartenpunkte.
   - Die Karte scrollt beim Öffnen zum höchsten freigeschalteten Punkt.
   - Erreichbare Punkte öffnen eine kompakte Vorschau; gesperrte Punkte zeigen Schloss und Voraussetzung.
   - Vorschau und Kartenpunkt zeigen Abschluss, Bonusziel, Erinnerungsfund, Bestwert und verwendete Eule symbolisch.
   - Eine erreichbare Szene kann direkt aus der Karte gestartet werden.

4. Kampagnenfortschritt erweitert
   - Der bestehende lokale Speicherstand bleibt abwärtskompatibel und erhält `highestScene`, `completedScenes` und `sceneRecords`.
   - Beim Abschluss werden Bestwert, Bonusstatus, Eule und Abschlusszeit gespeichert.
   - Nach einem Abschluss wird genau die nächste Szene freigeschaltet.
   - Ein vorhandener Checkpoint hebt die Freischaltung mindestens auf seine Szene an.
   - Kartenansicht und Speicherstand aktualisieren sich gegenseitig ohne eine zweite Leveltabelle.

5. Startmenü und Bedienung verbunden
   - Iconbasierter Button „Reisekarte“ ergänzt.
   - Karte besitzt Schließen-Schaltfläche, Escape-Unterstützung, Fokusziel und zugängliche Beschriftungen.
   - Kartenwischen ist vom Canvas getrennt und löst keine Flugsteuerung aus.

### Geänderte Dateien

- `ART_BIBLE.md`
- `assets/README.md`
- `index.html`
- `styles.css`
- `js/ui/chapter-map.js`
- `js/game.js`
- `IMPLEMENTIERUNGSPLAN.md`

### Prüfungen

- Datengenerator erfolgreich: 30 Level, 6 Eulen, 9 Storyabschnitte.
- Alle JSON-Dateien mit Formatversion 1 erfolgreich eingelesen.
- 88 HTML-IDs geprüft: keine Duplikate.
- 65 DOM-Referenzen aus `js/game.js` geprüft: keine fehlenden IDs.
- Headless-Browser hat 30 Kartenpunkte und die Szenenaktion gerendert.
- Visuelle Prüfung bei 740 × 400 im Handy-Querformat bestanden.
- Visuelle Prüfung bei 1366 × 900 als Galaxy-Tab-S11-nahe Querformatgröße bestanden.
- `git diff --check` ohne Whitespace-Fehler; vorhandene LF/CRLF-Hinweise sind keine Inhaltsfehler.
- Temporärer visueller Prüfzugang nach dem Test wieder entfernt.

### Bewusst noch offen

- Finale handgezeichnete SVG-Charaktere, Charakter-Sheets und Animationen.
- Weltkoordinaten, horizontale Kamera und Parallax-System im Gameplay.
- Speicherformat Version 2 mit Migration und explizitem Kapitelabschluss.
- Erinnerungsfunde als echte Spielobjekte; die Karte ist dafür bereits vorbereitet.
- Automatisierter JavaScript-Testlauf und vollständige Geräte-Matrix.

### Nächstes Arbeitspaket

P0-Paket 2 setzt die technische Modulstruktur und eine erste horizontale Welt um: gemeinsamer `window.OWL`-Namensraum, Kamera-Modul, Weltkoordinaten, drei bis sechs Bildschirmbreiten und fünf Parallax-Ebenen. Der Prolog dient als Vertical Slice.

## 20. Juli 2026 – P0-Paket 2: Horizontale Welt und Kamera

### Umgesetzt

1. Technischen Ausgangsstand dokumentiert
   - Datenquellen, Laufzeitspiegel und beide Local-Storage-Formate erfasst.
   - Wiederverwendete Kernsysteme von abzulösenden Arenaannahmen getrennt.
   - Nicht mehr aufgerufene Alt-Renderer und weitere Migrationskandidaten ausdrücklich markiert.

2. JavaScript weiter modularisiert
   - Gemeinsamen `window.OWL`-Namensraum mit doppelter Modulregistrierungsprüfung angelegt.
   - Kamera nach `js/core/camera.js` ausgelagert.
   - Weltvalidierung und -skalierung nach `js/world/world-loader.js` ausgelagert.
   - Parallax und Landmarken nach `js/render/parallax.js` ausgelagert.
   - Das Spiel bleibt ohne Bundler oder Paketinstallation startbar.

3. Datengetriebene Welten angelegt
   - `data/worlds/scenes.json` enthält 30 Szenen mit drei bis sechs Bildschirmbreiten.
   - Jede Szene besitzt Start, Ziel, wechselnde Nestposition, Kameramodus, zwei sichere Äste, zwei Landmarken, Triggerliste und Zielreferenz.
   - Das Build-Skript erzeugt `js/worlds.js` und prüft Pflichtfelder, Anzahl, Landmarken, doppelte IDs und Levelverweise.

4. Gameplay auf Weltkoordinaten umgestellt
   - Eule, Tiere, Rivalen, Hindernisse, Büsche, Effekte, Nest und Kollisionspunkte verwenden horizontale Weltkoordinaten.
   - Spawns erscheinen knapp außerhalb des aktuellen Kameraausschnitts statt an den Weltenden.
   - Touchpunkte werden vor der Steuerungsberechnung von Bildschirm- in Weltkoordinaten umgerechnet.
   - Checkpoints speichern nun auch Lumis Weltposition; alte Checkpoints bleiben kompatibel.
   - Beim Szenenwechsel werden Welt, Startposition, Nest, Kamera und prozedurale Objekte gemeinsam gewechselt.
   - Nur Objekte innerhalb eines gepolsterten Kameraausschnitts werden gezeichnet.

5. Horizontale Kamera umgesetzt
   - Weiches Folgen mit innerer Ruhezone und Geschwindigkeitsvorsprung.
   - Begrenzte vertikale Nachführung.
   - Modi `follow`, `race`, `dialogue`, `escort` und `cinematic`.
   - Sturzflug zoomt leicht heraus; Huuu erweitert den sichtbaren Bereich kurzzeitig.
   - Im Fynn-Kapitel wird der Mittelpunkt beider Figuren als Kamerafokus verwendet.

6. Fünf Tiefenebenen umgesetzt
   - Himmel, Sterne und Mond.
   - Ferne Hügel.
   - Mittlere Baumreihe, Boden und Nebel.
   - Spielbare Welt mit Kamera-Transformation.
   - Dunkle Vordergrundformen.
   - Jede Ebene verwendet einen eigenen Scrollfaktor.

7. Orientierung ergänzt
   - Zwei datengetriebene Landmarken pro Szene.
   - Sichere Äste besitzen ein einheitliches helles Flechtenmuster.
   - Das Nest erhält einen warmen Lichtschein.
   - Ein randnaher Richtungspfeil zeigt zum Erkundungsziel beziehungsweise beim Tragen zurück zum Nest.

### Prüfungen

- Build erfolgreich: 30 Level, 6 Eulen, 9 Storyabschnitte und 30 Welten.
- Weltbreiten geprüft: exakt 3,0 bis 6,0 aktuelle Bildschirmbreiten.
- Mindestens zwei Landmarken in jeder der 30 Welten.
- Kamerafahrt im 740 × 400-Test: 388 Weltpixel nach simuliertem Zielwechsel.
- Alle vier Canvas-Randpixel im Weltgrenzentest vollständig gefüllt (Alpha 255); keine leeren Randflächen.
- Keine Browser-Laufzeitmeldung im instrumentierten Gameplaytest.
- Visuelle Gameplayprüfung bei 740 × 400 und 1366 × 900 bestanden.
- Temporäre Testinstrumentierung vollständig entfernt.

### Bewusst noch offen

- Physische Landemechanik und echte Rastfunktion der sicheren Äste.
- Kapitelabhängige Windfelder und stärker variierender Nebel.
- Vollständig handgesetzte statt teilweise prozedural verteilter Hindernisse.
- Entfernung der nun unbenutzten alten Hintergrundfunktionen.
- Weitere Aufteilung von `js/game.js`, insbesondere Eingabe, Audio, Save, Akteure und Ziele.

### Nächstes Arbeitspaket

P0-Paket 3 baut Flug und Landung neu: direkte Beschleunigung ohne Joystick, sichtbares Bremsen, Ast-Snap, sichere Rastpunkte und fehlertolerante Wiederanläufe. Danach wird der Prolog als vollständiger Vertical Slice auf diese Mechanik abgestimmt.

## 20. Juli 2026 – P0-Paket 3: Flug, Landung und sicherer Wiederanlauf

### Umgesetzt

1. Feste Flugprofile für alle sechs Eulen
   - Beschleunigung, Bremsfaktor, Wendigkeit, Landegeschwindigkeit und Ast-Regeneration in `data/owls.json` ergänzt.
   - Build-Prüfung für alle fünf Pflichtwerte und doppelte Eulen-IDs ergänzt.
   - Upgrades verändern die Lenkempfindlichkeit nicht.

2. Fingerziel und Tastatur gleichwertig überarbeitet
   - Zielpunkt bleibt oberhalb des Fingers und wird nun in Bildschirmkoordinaten gezeichnet, sodass Kamerafahrten ihn nicht verschieben.
   - Weltziel wird während der Berührung laufend aus der festen Bildschirmposition berechnet.
   - Pfeiltasten und WASD verwenden dasselbe Beschleunigungsmodell.
   - Taste `F` wählt den nächsten erreichbaren Ast.

3. Lande- und Astsystem implementiert
   - Neues Modul `js/world/perches.js` kapselt Touch-Landezonen, Astsuche, Zielposition und gebremsten Anflug.
   - Antippen eines erreichbaren Asts startet den automatischen Anflug.
   - Eine neue Lenkbewegung bricht Anflug oder Sitzmodus sofort ab.
   - Lumi rastet exakt auf dem Ast ein und erhält eine eigene sitzende Flügelhaltung.
   - Aktiver Ast und großzügige unsichtbare Landezone sind voneinander getrennt.
   - Rivalen und Fledermäuse verursachen auf sicheren Ästen keinen Treffer.

4. Ausdauerregeln bereinigt
   - Keine passive Regeneration während des Flugs.
   - Ausdauer regeneriert ausschließlich beim Sitzen auf einem markierten Ast oder durch Glühwürmchen.
   - Die frühere kostenpflichtige Herzregeneration im Nest wurde entfernt.

5. Tragen differenziert
   - Kleine Objekte verursachen keinerlei Flugbeschränkung und können im Sturzflug getragen werden.
   - Große Objekte reduzieren nur Auftrieb und Bremsvermögen, nicht die Lenkempfindlichkeit.
   - Getragene Typen bleiben grafisch unterscheidbar.
   - Objekte werden im Nest automatisch oder über die kontextuelle Schaltfläche auf einem sicheren Ast abgelegt.
   - Abgelegte Objekte bleiben am Ast und sind erneut aufnehmbar.

6. Sichere Checkpoints
   - Landung speichert automatisch den kompletten Checkpoint.
   - Checkpoint enthält Weltposition, `flightState`, `perchId` und bereits besuchte Äste.
   - Fortsetzen stellt die exakte Sitzposition wieder her; ältere Checkpoints bleiben kompatibel.

7. Nicht-bestrafendes Fehlermodell
   - Kollisionen lösen eine 0,62 Sekunden lange Taumelphase aus.
   - Anschließend landet Lumi im nächsten sichtbaren Busch.
   - Keine verlorenen Herzen, Punkte, Ausdauer, Zeit oder Speicherstände.
   - Getragene Beute fällt weiterhin sichtbar herunter und das freiwillige Bonusziel kann scheitern.
   - Eigene Landungs- und Raschelklänge sowie Fynns Kommentar ergänzt.

### Prüfungen

- Build erfolgreich mit sechs vollständigen Flugprofilen.
- Automatisierter Browserablauf: `flying → approach → perched` erfolgreich.
- Ausdauer im Sitztest von 10 auf 34 gestiegen; außerhalb des Astes keine passive Regeneration.
- Gespeicherter Checkpoint enthielt `safe-1-a` und Zustand `perched`.
- Neue Lenkung wechselte zuverlässig von `perched` zu `flying`.
- Kollision und Buschlandung endeten wieder in `flying`; Herzänderung exakt 0.
- Keine Browser-Laufzeitmeldung im instrumentierten Test.
- Sitzhaltung und Astmarkierung bei 740 × 400 und 1366 × 900 visuell geprüft.
- Temporäre Testinstrumentierung vollständig entfernt.

### Bewusst noch offen

- Storydialoge konsequent an Sitz- und Beobachtungspunkte binden.
- Sturzflug für Rennen und Windpassagen szenenspezifisch einsetzen.
- Freundliche Tiere vollständig aus der bisherigen Fanglogik lösen.
- Prolog als gestufte Einführung für Fliegen, Landen, Tragen und Huuu umbauen.

### Nächstes Arbeitspaket

P0-Paket 4 überarbeitet Huuu zu einer vollständig kontextuellen Storyfähigkeit: Lichtspuren, versteckte Objekte, Beruhigen, entfernte Antworten und richtungsabhängige Audiohinweise.

## 20. Juli 2026 – P0-Paket 4: Huuu als kontextuelle Storyfähigkeit

### Umgesetzt

1. Datengetriebene Rufkontexte
   - `data/hoot-contexts.json` enthält 30 Szenen und 71 handgesetzte Interaktionen.
   - Build und Laufzeit prüfen IDs, Levelzuordnung, Typen und Pflichtfelder.
   - Einmalige Kontexte werden im Checkpoint gespeichert und beim Skalieren rekonstruiert.

2. Acht unterschiedliche Kontextwirkungen
   - Lichtspuren werden in fester Reihenfolge einzeln sichtbar.
   - Blattverstecke geben Funde und optionale Erinnerungen frei.
   - Glühwürmchen und Fynn lassen sich beruhigen.
   - Ava, Bruno und Fynn antworten über Distanz.
   - Blätter und Samen werden als gezeichnete Objekte bewegt.
   - Nebelmarken antworten sichtbar und akustisch.
   - Rivalen lassen Beute fallen und werden ohne Schaden zurückgedrängt.
   - Das Finale staffelt Antworten von Ava, Bruno, Fynn und Waldchor.

3. Lesbare Rückmeldung
   - Button und HUD zeigen Kontextsymbol, Funktion und Ladezustand.
   - Unregelmäßige Doppelwellen und acht Funktionsfarben ersetzen den generischen Effektkreis.
   - Entfernte Antworten erhalten Distanzverzögerung, Stereoposition, eigenen Klang und Randzeiger.
   - Ein falscher Ruf im Tutorial verbraucht keine Ladung.

### Prüfungen

- Build erfolgreich: 30 Kontextszenen und 71 Interaktionen.
- Browserprüfung für Tutorialverbrauch, Kontextverbrauch, Rivalenimpuls, Lichtspursequenz, Finalekette und Randhinweise bestanden.
- Normale Startszene ohne Laufzeitmeldung geladen.
- Huuu-Welle, Spurmarkierung und Randhinweis bei 740 × 400 sowie 1366 × 900 visuell geprüft.
- Temporäre Testinstrumentierung und Bilddateien anschließend entfernt.

### Bewusst noch offen

- Rufkontexte in Dialogtrigger und Begleiterzustände des nächsten Storypakets einbinden.
- Finale Antwortkette mit der späteren vollständigen Schlussinszenierung synchronisieren.
- Prolog-Tutorial schrittweise an Fliegen, Landen, Tragen und Huuu binden.

### Nächstes Arbeitspaket

P0-Paket 5 baut das Story-, Dialog- und Begleitersystem datengetrieben aus und bindet Dialoge an Weltposition, Landung, Huuu und Begleiterabstand.
