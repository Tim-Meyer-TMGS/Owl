# EULENFLUG – Flug-, Lande- und Fehlermodell

Stand: 20. Juli 2026

## Steuerungsprinzip

Auf Touchgeräten folgt Lumi einem Zielpunkt oberhalb des Fingers. Fingerposition und Zielpunkt werden als zwei kleine Kreise verbunden dargestellt. Der Zielpunkt bleibt relativ zum Bildschirm stabil, während die Kamera fährt. Es gibt keinen Joystick und keinen Geschwindigkeitsmultiplikator.

Tastatur:

- Pfeiltasten oder WASD: direkt lenken und einen Landeanflug abbrechen
- `F`: nächsten erreichbaren sicheren Ast anfliegen
- Leertaste: Sturzflug; im Sitzen mit getragenem Objekt stattdessen auf dem Ast ablegen
- `E`: Huuu
- `P`: Pause

## Flugprofile

Alle Werte stammen aus `data/owls.json`. Upgrades verändern weder Beschleunigung, Bremsweg noch Lenkempfindlichkeit.

| Eule | Beschleunigung | Bremsfaktor | Wendigkeit | Landeanflug | Ast-Regeneration/s |
|---|---:|---:|---:|---:|---:|
| Waldkauz | 720 | 0,120 | 8,5 | 210 | 18 |
| Schleiereule | 700 | 0,115 | 8,8 | 215 | 19 |
| Steinkauz | 820 | 0,100 | 10,5 | 230 | 20 |
| Uhu | 610 | 0,170 | 6,6 | 180 | 15 |
| Schneeeule | 650 | 0,150 | 7,2 | 190 | 17 |
| Sumpfohreule | 760 | 0,120 | 9,4 | 220 | 18 |

Kleinere Eulen beschleunigen und drehen schneller. Große Eulen besitzen einen längeren Bremsweg. Es gibt keine passive Ausdauerregeneration während des Flugs. Ausdauer kehrt nur über klar erkennbare Quellen zurück: ruhiges Sitzen auf einem markierten sicheren Ast oder ein Glühwürmchen.

## Flugzustände

| Zustand | Bedeutung | Übergang |
|---|---|---|
| `flying` | direkte Finger- oder Tastatursteuerung | Ast antippen oder `F` → `approach`; Kollision → `stumbling` |
| `approach` | automatisch gebremster Landeanflug | Ziel erreicht → `perched`; neue Lenkung → `flying` |
| `perched` | eingerastete Sitzposition und sicherer Ruhepunkt | neue Lenkung oder Sturzflug → `flying` |
| `stumbling` | kurze unkontrollierte, sichtbare Taumelphase | nach 0,62 Sekunden → weiche Buschlandung und `flying` |

## Sichere Äste

- Jede Szene enthält zwei datengetriebene Äste.
- Die unsichtbare Touch-Landezone ist breiter und höher als die gezeichnete Astform.
- Der aktive Ast erhält während Anflug und Sitzen eine sichtbare grüne Zielkontur.
- Beim Einrasten werden Position und Geschwindigkeit exakt stabilisiert.
- Die Landung speichert sofort Szene, Fortschritt, Weltposition, Ast-ID und Flugzustand.
- Ein Neustart stellt eine gespeicherte Sitzposition auf demselben Ast wieder her.
- Rivalen und Fledermäuse können Lumi im Sitzmodus nicht treffen.

## Tragen und Ablegen

Kleine Objekte verändern Beschleunigung, Bremsen, Geschwindigkeit und Sturzflug nicht. Das Kaninchen gilt vorläufig als großes Objekt: Es reduziert nur den Auftrieb und verlängert den Bremsweg; die Richtungssteuerung bleibt identisch.

Im Nest wird ein Objekt automatisch abgeliefert. Auf einem sicheren Ast wechselt die Sturzflugschaltfläche zu einem Ablegesymbol. Abgelegte Objekte bleiben am Ast sichtbar und können erneut aufgenommen werden.

## Fehler und Wiederanlauf

Kollisionen reduzieren keine Herzen, Punkte, Ausdauer, verbleibende Nacht oder gespeicherten Fortschritt. Stattdessen:

1. Lumi taumelt kurz sichtbar.
2. Getragene Beute fällt herunter.
3. Der nächste sichtbare Busch fängt Lumi auf.
4. Fynn kommentiert die Landung humorvoll.
5. Lumi startet nach kurzer Unverwundbarkeit direkt weiter.

Nest und sichere Äste bleiben geschützte Zonen. Das Bonusziel „ohne Treffer“ kann weiterhin scheitern, damit vorsichtiges Fliegen eine freiwillige Herausforderung bleibt.

