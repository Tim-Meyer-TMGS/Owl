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

