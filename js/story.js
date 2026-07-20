/* Generated from data/story.json. Run tools/build-levels.ps1 after editing the JSON source. */
window.OWL_STORY_DATA = {
  "formatVersion": 1,
  "title": "Das Fest der ersten Nacht",
  "characters": {
    "lumi": { "name": "Lumi", "symbol": "LU", "color": "#ffd469", "motif": [392, 523] },
    "fynn": { "name": "Fynn", "symbol": "FY", "color": "#9fe7ff", "motif": [440, 554] },
    "ava": { "name": "Ava", "symbol": "AV", "color": "#d9c7a4", "motif": [294, 392] },
    "bruno": { "name": "Bruno", "symbol": "BR", "color": "#c59a70", "motif": [185, 247] },
    "kauz": { "name": "Alter Kauz", "symbol": "AK", "color": "#b9c990", "motif": [220, 330] },
    "glow": { "name": "Glühwürmchen", "symbol": "✦", "color": "#dfff8d", "motif": [740, 990] }
  },
  "giftChoices": [
    { "id": "feather", "icon": "◜", "name": "weiche Feder" },
    { "id": "stone", "icon": "◆", "name": "glänzender Stein" },
    { "id": "leaf", "icon": "❧", "name": "rundes Blatt" },
    { "id": "twig", "icon": "⌁", "name": "kleiner Eichenzweig" }
  ],
  "chapters": [
    {
      "id": "prologue", "number": "Prolog", "title": "Die verlorenen Vorräte", "startLevel": 1, "endLevel": 1,
      "lines": [
        { "speaker": "fynn", "text": "Das war Absicht." },
        { "speaker": "ava", "text": "Der Wind hat die Leckerbissen für Fynns Flugfest im ganzen Wald verteilt." },
        { "speaker": "lumi", "text": "Ich habe alles zurück, bevor der Mond über der Eiche steht!" },
        { "speaker": "ava", "text": "Du könntest auch einfach vorsichtig fliegen." }
      ],
      "beats": [
        { "progress": 0.25, "speaker": "ava", "text": "Sturzflug für die Beute. Im Nest bist du sicher." },
        { "progress": 0.65, "speaker": "fynn", "text": "Hast du schon genug?" }
      ]
    },
    {
      "id": "meadow", "number": "Kapitel 1", "title": "Die Wiesenprüfung", "startLevel": 2, "endLevel": 4,
      "lines": [
        { "speaker": "lumi", "text": "Die Mondwiese. Mäuse, Käfer und Beeren – das wird leicht." },
        { "speaker": "fynn", "text": "Das hast du vor drei Mäusen auch gesagt." }
      ],
      "beats": [
        { "progress": 0.35, "speaker": "fynn", "text": "War das gerade ein gefährliches Tier?" },
        { "progress": 0.7, "speaker": "lumi", "text": "Nein. Ein sehr schlecht gelaunter Frosch." }
      ]
    },
    {
      "id": "firefly", "number": "Kapitel 2", "title": "Das verschwundene Glühwürmchen", "startLevel": 5, "endLevel": 8,
      "lines": [
        { "speaker": "glow", "text": "Eines unserer Kleinen hat sich im hohen Gras verirrt." },
        { "speaker": "lumi", "text": "Zeigt mir seine Lichtspur. Ich bringe es zurück." }
      ],
      "beats": [
        { "progress": 0.25, "speaker": "glow", "text": "Dein Huuu lässt verborgene Spuren aufleuchten." },
        { "progress": 0.7, "speaker": "lumi", "text": "Ich bleibe direkt über dir." }
      ]
    },
    {
      "id": "bruno", "number": "Kapitel 3", "title": "Der große Konkurrent", "startLevel": 9, "endLevel": 12,
      "lines": [
        { "speaker": "bruno", "text": "Der große Nachtfalter gehört mir! Vermutlich. Wo ist er?" },
        { "speaker": "lumi", "text": "Du hast etwas auf dem Kopf." },
        { "speaker": "bruno", "text": "Das sagen heute alle." }
      ],
      "beats": [
        { "progress": 0.4, "speaker": "lumi", "text": "Wir müssen nicht um jedes Fundstück kämpfen." },
        { "progress": 0.75, "speaker": "bruno", "text": "Dann zeige ich dir die Abkürzung durch die Wipfel!" }
      ]
    },
    {
      "id": "brook", "number": "Kapitel 4", "title": "Das Lied des Baches", "startLevel": 13, "endLevel": 16,
      "lines": [
        { "speaker": "fynn", "text": "Wie hoch bist du gerade?" },
        { "speaker": "lumi", "text": "Nicht sehr hoch. Der Bach klingt nur weit weg." }
      ],
      "beats": [
        { "progress": 0.35, "speaker": "lumi", "text": "Manchmal hilft es, erst einen sicheren Ast zu suchen." },
        { "progress": 0.72, "speaker": "fynn", "text": "Du bist also manchmal auch nervös?" }
      ]
    },
    {
      "id": "gift", "number": "Kapitel 5", "title": "Das Geschenk des Waldes", "startLevel": 17, "endLevel": 20, "requiresGift": true,
      "lines": [
        { "speaker": "kauz", "text": "Nur wer dem Flüstern der Wurzeln folgt, findet ein wahrhaftiges Geschenk." },
        { "speaker": "lumi", "text": "Was bedeutet das?" },
        { "speaker": "kauz", "text": "Hinter dem großen Baum links abbiegen." }
      ],
      "beats": [
        { "progress": 0.4, "speaker": "lumi", "text": "Nicht alles Wertvolle hat einen Punktwert." },
        { "progress": 0.78, "speaker": "fynn", "text": "Was versteckst du da?" }
      ]
    },
    {
      "id": "wind", "number": "Kapitel 6", "title": "Der Wind dreht sich", "startLevel": 21, "endLevel": 24,
      "lines": [
        { "speaker": "kauz", "text": "Vertraue dem Wind." },
        { "speaker": "lumi", "text": "Der Wind und ich müssen noch über Vertrauen sprechen." },
        { "speaker": "bruno", "text": "Ich fliege voraus. An mir kommt die Böe nicht vorbei!" }
      ],
      "beats": [
        { "progress": 0.3, "speaker": "glow", "text": "Folge unseren Lichtern durch die sichere Strömung." },
        { "progress": 0.72, "speaker": "bruno", "text": "Gemeinsam ist Gegenwind nur halb so windig!" }
      ]
    },
    {
      "id": "first-flight", "number": "Kapitel 7", "title": "Fynns erster Flug", "startLevel": 25, "endLevel": 29,
      "lines": [
        { "speaker": "fynn", "text": "Vielleicht fliege ich morgen." },
        { "speaker": "lumi", "text": "Morgen fühlt es sich wahrscheinlich genauso an." },
        { "speaker": "fynn", "text": "Hattest du heute Angst?" },
        { "speaker": "lumi", "text": "Beim Bach, im hohen Gras und ein bisschen bei Bruno." }
      ],
      "beats": [
        { "progress": 0.3, "speaker": "lumi", "text": "Nur bis zum nächsten Ast. Ich warte dort auf dich." },
        { "progress": 0.7, "speaker": "lumi", "text": "Ich bleibe direkt vor dir." }
      ]
    },
    {
      "id": "epilogue", "number": "Epilog", "title": "Das Fest im Mondlicht", "startLevel": 30, "endLevel": 30,
      "lines": [
        { "speaker": "ava", "text": "Wir feiern keinen perfekten Flug. Wir feiern, dass Fynn gesprungen ist." },
        { "speaker": "fynn", "text": "War dein erster Flug eigentlich besser?" },
        { "speaker": "lumi", "text": "Natürlich. Also gut – ich bin in einen Busch gefallen." },
        { "speaker": "fynn", "text": "Mit Absicht? Selbstverständlich." }
      ],
      "beats": [
        { "progress": 0.5, "speaker": "ava", "text": "Bringt die letzten Leckerbissen. Das Fest beginnt!" }
      ]
    }
  ]
}
;
