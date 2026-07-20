# EULENFLUG – verbindliche Art Bible

Version 1.0 · 20. Juli 2026

Diese Regeln gelten für alle neuen und überarbeiteten Grafiken. Abweichungen werden vor der Umsetzung begründet und im `docs/IMPLEMENTIERUNGSLOG.md` festgehalten.

## 1. Bildidee

EULENFLUG sieht wie ein von Hand gestaltetes Nacht-Bilderbuch aus: klare Scherenschnittformen, wenige Siebdruckfarben, bewusst gesetzte Papierkörnung und warme Figuren vor kühlen Waldflächen. Die Illustration bleibt ruhig genug für ein schnelles Touch-Spiel. Lesbarkeit hat Vorrang vor Dekoration.

Zulässige Produktionsmittel sind von Hand gezeichnete, versionierte SVG-Pfade, selbst erstellte feste Texturen und kleine, bewusst gesetzte Schlüsselbildanimationen. Jede sichtbare Form muss reproduzierbar und redaktionell prüfbar sein.

## 2. Formensprache und Konturen

- Figuren bestehen aus großen, weichen Grundformen. Augen, Halstücher, Schnäbel und getragene Gegenstände bilden die stärksten Kontraste.
- Spielrelevante Tiere sind rund und bodennah. Gefahren sind kantiger und besitzen nach vorn gerichtete Formen. Sichere Objekte verwenden offene, nach oben zeigende Bögen.
- Äste, Steine und Blätter werden als individuell gesetzte Varianten gezeichnet; keine zufällige Formänderung pro Frame.
- Alle Laufzeit-SVGs verwenden ein ganzzahliges `viewBox`-Raster. Das Grundraster für Figuren ist `0 0 128 128`, für Icons `0 0 24 24`.
- Konturen bei 128 × 128 Quelldarstellung:
  - Hauptfigur und Begleiter: 5 px
  - kleine Tiere und interaktive Gegenstände: 4 px
  - spielbare Umgebung und Hindernisse: 5 px
  - Hintergrundformen: 0–3 px
  - Vordergrundsilhouetten: 6 px oder konturlos als geschlossene Fläche
- Konturen skalieren mit dem Asset. Sie bleiben an mobilen Zielgrößen mindestens 1,5 physische Pixel stark.
- Linienenden und Ecken sind grundsätzlich rund. Spitze Formen sind Rivalen, Dornen und Windmarkierungen vorbehalten.

## 3. Größen- und Silhouettenraster

Lumis Körperhöhe ist die Referenz `1,00 LU`.

| Figur | Höhe | Breite | Unverwechselbares Merkmal |
|---|---:|---:|---|
| Lumi | 1,00 LU | 0,72 LU | schlanke Tropfensilhouette, gelbes Halstuch |
| Fynn | 0,72 LU | 0,68 LU | runder Körper, kurzes hellblaues Halstuch |
| Ava | 1,18 LU | 1,02 LU | breite ruhige Flügel, cremefarbener Gesichtskranz |
| Bruno | 1,12 LU | 1,10 LU | kantige Flügel, schiefe Brille |
| Alter Kauz | 1,05 LU | 0,90 LU | zerzauste Brauen, Moosbüschel |
| Rivaleneule klein | 0,76 LU | 0,62 LU | schmale Sichelflügel |
| Glühwürmchen | 0,12 LU | 0,12 LU | festes zweiteiliges Lichtmuster |

Im Gameplay ist Lumi auf Handys im Querformat mindestens 44 CSS-Pixel hoch, auf 10–12-Zoll-Tablets 58–72 CSS-Pixel. Fynn darf nie kleiner als 32 beziehungsweise 44 CSS-Pixel erscheinen. Die Silhouette muss auch einfarbig und bei 25 % Zoom erkennbar bleiben.

## 4. Licht und Nachtkontrast

- Der Mond ist die gemeinsame Hauptlichtquelle und steht bildlogisch links oben. Oberkanten erhalten ein kühles Kantenlicht; Schlagschatten fallen nach rechts unten.
- Nest, Fest und vertraute Figuren liefern warmes bernsteinfarbenes Sekundärlicht. Warm bedeutet Sicherheit, nicht Belohnungs-Seltenheit.
- Interaktive Formen erreichen zum direkten Hintergrund mindestens 3:1 Helligkeitskontrast; HUD-Text mindestens 4,5:1.
- Schwarz wird nicht verwendet. Die dunkelste Farbe ist Tintenblau `#080d18`.
- Glows bleiben klein: maximal 1,5-mal der Durchmesser des leuchtenden Objekts und höchstens 35 % Deckkraft. Huuu darf diesen Wert für höchstens 350 ms überschreiten.
- Texturen verändern nie die Silhouette oder den Kontrast eines spielrelevanten Objekts.

## 5. Kapitelpaletten

Jede Palette besitzt höchstens acht Hauptfarben. Transparenzen und daraus gebildete Mischwerte zählen nicht als neue Farbe, dürfen aber keine neue Farbfamilie einführen.

| Abschnitt | Tinte | Himmel | Ferne | Laub | Akzent kühl | Akzent warm | Licht | Gefahr |
|---|---|---|---|---|---|---|---|---|
| Alte Eiche / Prolog | `#0a1020` | `#172344` | `#26385a` | `#385545` | `#82cbd8` | `#c18a52` | `#f2d58a` | `#a95358` |
| Mondwiese | `#09131f` | `#17314b` | `#31566a` | `#47705a` | `#80d0c4` | `#d69b58` | `#f6dc83` | `#b85955` |
| Birkenhain | `#0b1020` | `#22294b` | `#4b5270` | `#48634f` | `#a9c8d4` | `#bd895b` | `#f0e2b4` | `#a84f61` |
| Brunos Baumwipfel | `#0b0d1a` | `#282443` | `#53456a` | `#4e6046` | `#8db8c7` | `#cf8751` | `#efd18a` | `#b24c47` |
| Bach und Schlucht | `#07121d` | `#132d48` | `#244d61` | `#315b51` | `#74c8dc` | `#b68052` | `#d7e9bd` | `#a94b56` |
| Erinnerungswald | `#101021` | `#2d2649` | `#54436a` | `#536249` | `#9bbfc2` | `#c98e61` | `#ead58f` | `#a84d63` |
| Windpass | `#08121d` | `#17334d` | `#3a5f72` | `#416457` | `#91d4df` | `#c88f58` | `#e8e5b5` | `#b7564d` |
| Fynns Flugroute | `#0a1020` | `#25365b` | `#4d6180` | `#536d5c` | `#9fe7ff` | `#d79a55` | `#ffe39a` | `#ad5960` |
| Fest im Mondlicht | `#0c1020` | `#302b55` | `#5b5077` | `#546b55` | `#9edee2` | `#e2a35e` | `#ffe7a0` | `#b85b62` |

Figuren behalten ihre Identitätsfarben kapitelübergreifend. Kapitellicht darf sie tönen, aber Halstuch und Augen müssen eindeutig bleiben.

## 6. Raumtiefe und Umgebung

Die Welt verwendet fünf feste Ebenen: Himmel, ferne Hügel, mittlere Baumreihen, spielbare Ebene und Vordergrund. Details werden nach hinten kleiner, kontrastärmer und kühler. Vordergrundformen dürfen den Bildrand rahmen, Missionsziele aber nie länger als 400 ms verdecken.

Jede Szene erhält zwei handgesetzte Landmarken. Ein Kapitel besitzt eine dominante Baumart und höchstens drei wiederkehrende Requisiten. Wiederholungen werden gespiegelt oder verschoben, nicht zufällig verformt.

## 7. Figuren- und Bewegungsregeln

- Blickrichtung folgt der tatsächlichen Bewegungsrichtung. Text, Halstuchknoten und asymmetrische Merkmale werden nicht durch blindes Spiegeln vertauscht.
- Richtungswechsel besitzen eine kurze Brems-, Dreh- und Beschleunigungsphase.
- Flügelschläge verwenden 4–6 klare Schlüsselbilder; Landen und Huuu 5–8. Kein automatisches Morphing zwischen unpassenden Pfaden.
- Kleine Eulen schlagen schneller, große Eulen mit größerer Amplitude. Getragene Beute verändert Haltung und Flügelschlag sichtbar.
- Animationen verändern weder Trefferfläche noch erkennbare Körpergröße sprunghaft.
- Idle-Bewegung bleibt unter 4 % der Körperhöhe. Dauerndes Wabern, Atmen aller Flächen oder generisches Schweben ist untersagt.

## 8. Icons und UI

- Icons sind einfarbige, handgesetzte SVG-Linien im 24er-Raster mit 1,8 px Strichstärke und runden Enden.
- Text wird auf Touch-Oberflächen auf Handlung, Zahl und kurze Statuswörter reduziert. Ein Icon braucht immer einen zugänglichen Namen (`aria-label` oder sichtbaren Text).
- Touch-Ziele sind mindestens 44 × 44 CSS-Pixel, auf großen Tablets bevorzugt 52 × 52 CSS-Pixel.
- Kartenpunkte, Bonusziele und Fundstücke unterscheiden sich zusätzlich durch Form; Farbe allein reicht nicht.
- Panels verwenden flache Tintenflächen und eine einzige Kontur. Glas-, Plastik- und Neonoptik werden nicht eingesetzt.

## 9. Texturen

Es gibt genau drei feste, nahtlos kachelbare Texturfamilien: Papierfaser, trockener Pinsel und feine Siebdruckkörnung. Sie werden einmal als manuelle Quelldatei erstellt und nicht zur Laufzeit zufällig erzeugt.

- Papier: 6–10 % Deckkraft, nur auf großen Hintergrundflächen.
- Pinsel: 8–16 %, gezielt an Wolken, Nebel und Rinde.
- Körnung: 4–7 %, flächig; niemals auf Augen, Icons oder Text.

## 10. Verbotene Gestaltungsmittel

- keine generierten Bilder oder generativ variierten Assets
- keine fotorealistischen Texturen, Fotos oder Materialscans unbekannter Herkunft
- keine zufälligen Detailmuster auf Figuren
- keine inkonsistenten Perspektiven oder Lichtquellen
- keine übermäßigen Neon-Glows, Chrom-, Glas- oder 3D-Plastikoberflächen
- keine wechselnde Anatomie, zusätzliche Zehen, Flügel oder Gesichtselemente
- keine unkontrollierten Filterketten, automatische Vektorisierung oder KI-Upscaler
- keine Emoji als Spielgrafik
- keine austauschbaren Clip-Art-Silhouetten

## 11. Asset-Pipeline

Quelldateien liegen unter `assets/source/`, geprüfte Laufzeitdateien unter `assets/runtime/`. Dateinamen folgen `bereich-figur-aktion-variante.svg`, ausschließlich in Kleinbuchstaben und mit Bindestrichen. Laufzeitdateien werden nie manuell als einzige Quelle bearbeitet.

Jedes Asset durchläuft diese Prüfung:

1. Silhouette bei 25 % Zoom eindeutig.
2. Blick- und Bewegungsrichtung korrekt.
3. Palette und Konturstärke entsprechen dem Kapitel beziehungsweise Figurensheet.
4. `viewBox`, Titel, semantische ID und Farbtokens sind vorhanden.
5. Lesbarkeit bei 740 × 400 sowie 1366 × 900 geprüft.
6. Quelle, Autor und Datum im Asset-Index dokumentiert.
7. Keine verbotenen Gestaltungsmittel oder ungeklärte Fremdassets enthalten.

Erst danach darf eine optimierte Kopie unter `assets/runtime/` verwendet werden.

