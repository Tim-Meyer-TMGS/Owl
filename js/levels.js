/* Generated from data/levels.json. Run tools/build-levels.ps1 after editing the JSON source. */
window.OWL_LEVEL_DATA = {
  "formatVersion": 1,
  "campaign": {
    "id": "eulenflug-hauptnacht",
    "name": "Die lange Nacht",
    "startingTimeSeconds": 90,
    "startingHearts": 3,
    "maximumHearts": 4
  },
  "levels": [
    {
      "id": "level-01-wiesenrand",
      "order": 1,
      "name": "Die verlorenen Vorräte",
      "presentation": {
        "theme": "meadow",
        "intro": "Der Wind hat drei Vorratspäckchen über die ruhige Wiese verteilt.",
        "mission": "Bring drei Vorratspäckchen zurück ins Nest.",
        "shortMission": "3 Päckchen",
        "scenery": {
          "terrain": "rolling-hills",
          "trees": [
            "oak",
            "birch"
          ],
          "obstacles": [
            "stump",
            "branch"
          ]
        }
      },
      "objective": {
        "type": "bundles",
        "target": 3,
        "requiredPrey": "bundle"
      },
      "timeBonusSeconds": 0,
      "difficulty": {
        "speedMultiplier": 1,
        "timeDrainMultiplier": 0,
        "hitPenaltySeconds": 3
      },
      "population": {
        "prey": {"bundle": 1},
        "startingPrey": 0,
        "maximumPrey": 3,
        "spawnDelaySeconds": {
          "min": 0.5,
          "max": 0.8
        }
      },
      "waves": {
        "size": 0,
        "breakSeconds": 4.2
      },
      "hazards": {
        "branches": 0,
        "maximumBats": 0,
        "batSpawnDelaySeconds": {
          "min": 2.88,
          "max": 4.5
        },
        "maximumRivalOwls": 0,
        "rivalOwlSpawnDelaySeconds": {
          "min": 7.4,
          "max": 9.6
        }
      },
      "pickups": {
        "maximumFireflies": 6,
        "fireflySpawnDelaySeconds": {
          "min": 2.8,
          "max": 3.7
        }
      },
      "audio": {
        "chordHz": [
          196,
          246.94,
          293.66
        ]
      }
    },
    {
      "id": "level-02-heckenpfad",
      "order": 2,
      "name": "Heckenpfad",
      "presentation": {
        "theme": "meadow",
        "intro": "Zwischen engen Hecken werden die ersten Ausweichmanöver nötig.",
        "mission": "Sammle 35 Futterpunkte im Nest.",
        "shortMission": "35 Futterpunkte",
        "scenery": {
          "terrain": "rolling-hills",
          "trees": [
            "birch",
            "oak"
          ],
          "obstacles": [
            "branch",
            "stump"
          ]
        }
      },
      "objective": {
        "type": "foodPoints",
        "target": 35,
        "requiredPrey": null
      },
      "timeBonusSeconds": 19,
      "difficulty": {
        "speedMultiplier": 1.012,
        "timeDrainMultiplier": 1.008,
        "hitPenaltySeconds": 3
      },
      "population": {
        "prey": {
          "normal": 5,
          "beetle": 1,
          "rabbit": 1,
          "gold": 1
        },
        "startingPrey": 4,
        "maximumPrey": 10,
        "spawnDelaySeconds": {
          "min": 0.48,
          "max": 0.78
        }
      },
      "waves": {
        "size": 5,
        "breakSeconds": 4.13
      },
      "hazards": {
        "branches": 2,
        "maximumBats": 4,
        "batSpawnDelaySeconds": {
          "min": 2.8,
          "max": 4.38
        },
        "maximumRivalOwls": 0,
        "rivalOwlSpawnDelaySeconds": {
          "min": 7.2,
          "max": 9.4
        }
      },
      "pickups": {
        "maximumFireflies": 6,
        "fireflySpawnDelaySeconds": {
          "min": 2.75,
          "max": 3.65
        }
      },
      "audio": {
        "chordHz": [
          196,
          246.94,
          293.66
        ]
      }
    },
    {
      "id": "level-03-bachufer",
      "order": 3,
      "name": "Bachufer",
      "presentation": {
        "theme": "forest",
        "intro": "Am Bachufer huscht die Beute zwischen Wasser und Wurzeln.",
        "mission": "Sammle 40 Futterpunkte im Nest.",
        "shortMission": "40 Futterpunkte",
        "scenery": {
          "terrain": "deep-forest",
          "trees": [
            "pine",
            "oak",
            "birch"
          ],
          "obstacles": [
            "branch",
            "thorn",
            "trunk"
          ]
        }
      },
      "objective": {
        "type": "foodPoints",
        "target": 40,
        "requiredPrey": null
      },
      "timeBonusSeconds": 19,
      "difficulty": {
        "speedMultiplier": 1.024,
        "timeDrainMultiplier": 1.016,
        "hitPenaltySeconds": 3
      },
      "population": {
        "prey": {
          "normal": 5,
          "beetle": 1,
          "rabbit": 1,
          "swift": 1,
          "gold": 1
        },
        "startingPrey": 4,
        "maximumPrey": 10,
        "spawnDelaySeconds": {
          "min": 0.47,
          "max": 0.77
        }
      },
      "waves": {
        "size": 5,
        "breakSeconds": 4.05
      },
      "hazards": {
        "branches": 2,
        "maximumBats": 4,
        "batSpawnDelaySeconds": {
          "min": 2.73,
          "max": 4.26
        },
        "maximumRivalOwls": 0,
        "rivalOwlSpawnDelaySeconds": {
          "min": 7,
          "max": 9.2
        }
      },
      "pickups": {
        "maximumFireflies": 6,
        "fireflySpawnDelaySeconds": {
          "min": 2.69,
          "max": 3.59
        }
      },
      "audio": {
        "chordHz": [
          174.61,
          220,
          261.63
        ]
      }
    },
    {
      "id": "level-04-mondwald",
      "order": 4,
      "name": "Mondwald",
      "presentation": {
        "theme": "forest",
        "intro": "Im Mondwald kreuzen mehr Fledermäuse und Äste deinen Weg.",
        "mission": "Sammle 45 Futterpunkte im Nest.",
        "shortMission": "45 Futterpunkte",
        "scenery": {
          "terrain": "deep-forest",
          "trees": [
            "oak",
            "birch",
            "pine"
          ],
          "obstacles": [
            "thorn",
            "trunk",
            "branch"
          ]
        }
      },
      "objective": {
        "type": "foodPoints",
        "target": 45,
        "requiredPrey": null
      },
      "timeBonusSeconds": 20,
      "difficulty": {
        "speedMultiplier": 1.036,
        "timeDrainMultiplier": 1.024,
        "hitPenaltySeconds": 3
      },
      "population": {
        "prey": {
          "normal": 5,
          "beetle": 1,
          "rabbit": 1,
          "swift": 1,
          "gold": 1
        },
        "startingPrey": 4,
        "maximumPrey": 11,
        "spawnDelaySeconds": {
          "min": 0.45,
          "max": 0.75
        }
      },
      "waves": {
        "size": 5,
        "breakSeconds": 3.98
      },
      "hazards": {
        "branches": 3,
        "maximumBats": 5,
        "batSpawnDelaySeconds": {
          "min": 2.65,
          "max": 4.14
        },
        "maximumRivalOwls": 1,
        "rivalOwlSpawnDelaySeconds": {
          "min": 6.8,
          "max": 9
        }
      },
      "pickups": {
        "maximumFireflies": 6,
        "fireflySpawnDelaySeconds": {
          "min": 2.64,
          "max": 3.54
        }
      },
      "audio": {
        "chordHz": [
          174.61,
          220,
          261.63
        ]
      }
    },
    {
      "id": "level-05-dornenhain",
      "order": 5,
      "name": "Dornenhain",
      "presentation": {
        "theme": "forest",
        "intro": "Der Dornenhain lässt nur schmale Flugwege offen.",
        "mission": "Sammle 50 Futterpunkte im Nest.",
        "shortMission": "50 Futterpunkte",
        "scenery": {
          "terrain": "deep-forest",
          "trees": [
            "birch",
            "pine",
            "oak"
          ],
          "obstacles": [
            "trunk",
            "branch",
            "thorn"
          ]
        }
      },
      "objective": {
        "type": "foodPoints",
        "target": 50,
        "requiredPrey": null
      },
      "timeBonusSeconds": 21,
      "difficulty": {
        "speedMultiplier": 1.048,
        "timeDrainMultiplier": 1.032,
        "hitPenaltySeconds": 3
      },
      "population": {
        "prey": {
          "normal": 5,
          "beetle": 1,
          "rabbit": 1,
          "swift": 1,
          "frog": 1,
          "gold": 1
        },
        "startingPrey": 4,
        "maximumPrey": 11,
        "spawnDelaySeconds": {
          "min": 0.43,
          "max": 0.73
        }
      },
      "waves": {
        "size": 6,
        "breakSeconds": 3.9
      },
      "hazards": {
        "branches": 3,
        "maximumBats": 5,
        "batSpawnDelaySeconds": {
          "min": 2.57,
          "max": 4.02
        },
        "maximumRivalOwls": 1,
        "rivalOwlSpawnDelaySeconds": {
          "min": 6.6,
          "max": 8.8
        }
      },
      "pickups": {
        "maximumFireflies": 6,
        "fireflySpawnDelaySeconds": {
          "min": 2.58,
          "max": 3.48
        }
      },
      "audio": {
        "chordHz": [
          174.61,
          220,
          261.63
        ]
      }
    },
    {
      "id": "level-06-nebelmoor",
      "order": 6,
      "name": "Nebelmoor",
      "presentation": {
        "theme": "mist",
        "intro": "Im Nebelmoor verschwinden Beute und Hindernisse im Dunst.",
        "mission": "Sammle 55 Futterpunkte im Nest.",
        "shortMission": "55 Futterpunkte",
        "scenery": {
          "terrain": "marsh",
          "trees": [
            "willow",
            "birch",
            "dead"
          ],
          "obstacles": [
            "branch",
            "stump",
            "thorn"
          ]
        }
      },
      "objective": {
        "type": "foodPoints",
        "target": 55,
        "requiredPrey": null
      },
      "timeBonusSeconds": 21,
      "difficulty": {
        "speedMultiplier": 1.06,
        "timeDrainMultiplier": 1.04,
        "hitPenaltySeconds": 3
      },
      "population": {
        "prey": {
          "normal": 5,
          "beetle": 1,
          "rabbit": 1,
          "swift": 1,
          "frog": 1,
          "gold": 2
        },
        "startingPrey": 5,
        "maximumPrey": 11,
        "spawnDelaySeconds": {
          "min": 0.42,
          "max": 0.72
        }
      },
      "waves": {
        "size": 6,
        "breakSeconds": 3.83
      },
      "hazards": {
        "branches": 3,
        "maximumBats": 5,
        "batSpawnDelaySeconds": {
          "min": 2.5,
          "max": 3.9
        },
        "maximumRivalOwls": 1,
        "rivalOwlSpawnDelaySeconds": {
          "min": 6.4,
          "max": 8.6
        }
      },
      "pickups": {
        "maximumFireflies": 6,
        "fireflySpawnDelaySeconds": {
          "min": 2.53,
          "max": 3.43
        }
      },
      "audio": {
        "chordHz": [
          164.81,
          207.65,
          246.94
        ]
      }
    },
    {
      "id": "level-07-froschsumpf",
      "order": 7,
      "name": "Froschsumpf",
      "presentation": {
        "theme": "mist",
        "intro": "Frösche springen unberechenbar durch den tiefen Sumpf.",
        "mission": "Sammle 60 Futterpunkte im Nest.",
        "shortMission": "60 Futterpunkte",
        "scenery": {
          "terrain": "marsh",
          "trees": [
            "birch",
            "dead",
            "willow"
          ],
          "obstacles": [
            "stump",
            "thorn",
            "branch"
          ]
        }
      },
      "objective": {
        "type": "foodPoints",
        "target": 60,
        "requiredPrey": null
      },
      "timeBonusSeconds": 22,
      "difficulty": {
        "speedMultiplier": 1.072,
        "timeDrainMultiplier": 1.048,
        "hitPenaltySeconds": 4
      },
      "population": {
        "prey": {
          "normal": 4,
          "beetle": 1,
          "rabbit": 1,
          "swift": 1,
          "frog": 1,
          "gold": 2
        },
        "startingPrey": 5,
        "maximumPrey": 12,
        "spawnDelaySeconds": {
          "min": 0.4,
          "max": 0.7
        }
      },
      "waves": {
        "size": 6,
        "breakSeconds": 3.75
      },
      "hazards": {
        "branches": 4,
        "maximumBats": 6,
        "batSpawnDelaySeconds": {
          "min": 2.42,
          "max": 3.78
        },
        "maximumRivalOwls": 1,
        "rivalOwlSpawnDelaySeconds": {
          "min": 6.2,
          "max": 8.4
        }
      },
      "pickups": {
        "maximumFireflies": 6,
        "fireflySpawnDelaySeconds": {
          "min": 2.47,
          "max": 3.37
        }
      },
      "audio": {
        "chordHz": [
          164.81,
          207.65,
          246.94
        ]
      }
    },
    {
      "id": "level-08-kaferlichtung",
      "order": 8,
      "name": "Käferlichtung",
      "presentation": {
        "theme": "mist",
        "intro": "Kleine Käfer verstecken sich zwischen dichten Nebelbänken.",
        "mission": "Sammle 65 Futterpunkte im Nest.",
        "shortMission": "65 Futterpunkte",
        "scenery": {
          "terrain": "marsh",
          "trees": [
            "dead",
            "willow",
            "birch"
          ],
          "obstacles": [
            "thorn",
            "branch",
            "stump"
          ]
        }
      },
      "objective": {
        "type": "foodPoints",
        "target": 65,
        "requiredPrey": null
      },
      "timeBonusSeconds": 23,
      "difficulty": {
        "speedMultiplier": 1.084,
        "timeDrainMultiplier": 1.056,
        "hitPenaltySeconds": 4
      },
      "population": {
        "prey": {
          "normal": 4,
          "beetle": 1,
          "rabbit": 1,
          "swift": 1,
          "frog": 1,
          "gold": 2
        },
        "startingPrey": 5,
        "maximumPrey": 12,
        "spawnDelaySeconds": {
          "min": 0.38,
          "max": 0.68
        }
      },
      "waves": {
        "size": 6,
        "breakSeconds": 3.68
      },
      "hazards": {
        "branches": 4,
        "maximumBats": 6,
        "batSpawnDelaySeconds": {
          "min": 2.34,
          "max": 3.66
        },
        "maximumRivalOwls": 1,
        "rivalOwlSpawnDelaySeconds": {
          "min": 6,
          "max": 8.2
        }
      },
      "pickups": {
        "maximumFireflies": 7,
        "fireflySpawnDelaySeconds": {
          "min": 2.42,
          "max": 3.32
        }
      },
      "audio": {
        "chordHz": [
          164.81,
          207.65,
          246.94
        ]
      }
    },
    {
      "id": "level-09-alte-eiche",
      "order": 9,
      "name": "Alte Eiche",
      "presentation": {
        "theme": "forest",
        "intro": "Rund um die Alte Eiche wird der Luftraum immer enger.",
        "mission": "Sammle 70 Futterpunkte im Nest.",
        "shortMission": "70 Futterpunkte",
        "scenery": {
          "terrain": "deep-forest",
          "trees": [
            "pine",
            "oak",
            "birch"
          ],
          "obstacles": [
            "branch",
            "thorn",
            "trunk"
          ]
        }
      },
      "objective": {
        "type": "foodPoints",
        "target": 70,
        "requiredPrey": null
      },
      "timeBonusSeconds": 23,
      "difficulty": {
        "speedMultiplier": 1.096,
        "timeDrainMultiplier": 1.064,
        "hitPenaltySeconds": 4
      },
      "population": {
        "prey": {
          "normal": 4,
          "beetle": 1,
          "rabbit": 1,
          "swift": 1,
          "frog": 1,
          "gold": 2
        },
        "startingPrey": 5,
        "maximumPrey": 12,
        "spawnDelaySeconds": {
          "min": 0.36,
          "max": 0.66
        }
      },
      "waves": {
        "size": 7,
        "breakSeconds": 3.6
      },
      "hazards": {
        "branches": 4,
        "maximumBats": 6,
        "batSpawnDelaySeconds": {
          "min": 2.27,
          "max": 3.54
        },
        "maximumRivalOwls": 1,
        "rivalOwlSpawnDelaySeconds": {
          "min": 5.8,
          "max": 8
        }
      },
      "pickups": {
        "maximumFireflies": 7,
        "fireflySpawnDelaySeconds": {
          "min": 2.36,
          "max": 3.26
        }
      },
      "audio": {
        "chordHz": [
          174.61,
          220,
          261.63
        ]
      }
    },
    {
      "id": "level-10-goldene-spur",
      "order": 10,
      "name": "Goldene Spur",
      "presentation": {
        "theme": "gold",
        "intro": "Eine seltene goldene Maus erscheint zwischen den Wurzeln.",
        "mission": "Sammle 50 Futterpunkte mit goldener Beute.",
        "shortMission": "Gold 50 Punkte",
        "scenery": {
          "terrain": "autumn-hills",
          "trees": [
            "birch",
            "oak"
          ],
          "obstacles": [
            "stump",
            "rock",
            "branch"
          ]
        }
      },
      "objective": {
        "type": "foodPoints",
        "target": 50,
        "requiredPrey": "gold"
      },
      "timeBonusSeconds": 24,
      "difficulty": {
        "speedMultiplier": 1.108,
        "timeDrainMultiplier": 1.072,
        "hitPenaltySeconds": 4
      },
      "population": {
        "prey": {
          "normal": 4,
          "beetle": 1,
          "rabbit": 2,
          "swift": 1,
          "frog": 1,
          "gold": 3
        },
        "startingPrey": 5,
        "maximumPrey": 13,
        "spawnDelaySeconds": {
          "min": 0.35,
          "max": 0.65
        }
      },
      "waves": {
        "size": 7,
        "breakSeconds": 3.53
      },
      "hazards": {
        "branches": 5,
        "maximumBats": 7,
        "batSpawnDelaySeconds": {
          "min": 2.19,
          "max": 3.42
        },
        "maximumRivalOwls": 1,
        "rivalOwlSpawnDelaySeconds": {
          "min": 5.6,
          "max": 7.8
        }
      },
      "pickups": {
        "maximumFireflies": 7,
        "fireflySpawnDelaySeconds": {
          "min": 2.31,
          "max": 3.21
        }
      },
      "audio": {
        "chordHz": [
          220,
          277.18,
          329.63
        ]
      }
    },
    {
      "id": "level-11-sturmklippen",
      "order": 11,
      "name": "Sturmklippen",
      "presentation": {
        "theme": "storm",
        "intro": "An den Sturmklippen jagen Schwärme durch peitschenden Wind.",
        "mission": "Sammle 80 Futterpunkte im Nest.",
        "shortMission": "80 Futterpunkte",
        "scenery": {
          "terrain": "cliffs",
          "trees": [
            "dead",
            "pine"
          ],
          "obstacles": [
            "trunk",
            "rock",
            "thorn"
          ]
        }
      },
      "objective": {
        "type": "foodPoints",
        "target": 80,
        "requiredPrey": null
      },
      "timeBonusSeconds": 25,
      "difficulty": {
        "speedMultiplier": 1.12,
        "timeDrainMultiplier": 1.08,
        "hitPenaltySeconds": 4
      },
      "population": {
        "prey": {
          "normal": 4,
          "beetle": 1,
          "rabbit": 2,
          "swift": 1,
          "frog": 1,
          "gold": 2
        },
        "startingPrey": 6,
        "maximumPrey": 13,
        "spawnDelaySeconds": {
          "min": 0.33,
          "max": 0.63
        }
      },
      "waves": {
        "size": 7,
        "breakSeconds": 3.45
      },
      "hazards": {
        "branches": 5,
        "maximumBats": 7,
        "batSpawnDelaySeconds": {
          "min": 2.11,
          "max": 3.3
        },
        "maximumRivalOwls": 2,
        "rivalOwlSpawnDelaySeconds": {
          "min": 5.4,
          "max": 7.6
        }
      },
      "pickups": {
        "maximumFireflies": 7,
        "fireflySpawnDelaySeconds": {
          "min": 2.25,
          "max": 3.15
        }
      },
      "audio": {
        "chordHz": [
          146.83,
          196,
          233.08
        ]
      }
    },
    {
      "id": "level-12-windschlucht",
      "order": 12,
      "name": "Windschlucht",
      "presentation": {
        "theme": "storm",
        "intro": "In der Windschlucht bleibt kaum Zeit für Kurskorrekturen.",
        "mission": "Sammle 85 Futterpunkte im Nest.",
        "shortMission": "85 Futterpunkte",
        "scenery": {
          "terrain": "cliffs",
          "trees": [
            "pine",
            "dead"
          ],
          "obstacles": [
            "rock",
            "thorn",
            "trunk"
          ]
        }
      },
      "objective": {
        "type": "foodPoints",
        "target": 85,
        "requiredPrey": null
      },
      "timeBonusSeconds": 25,
      "difficulty": {
        "speedMultiplier": 1.132,
        "timeDrainMultiplier": 1.088,
        "hitPenaltySeconds": 4
      },
      "population": {
        "prey": {
          "normal": 4,
          "beetle": 1,
          "rabbit": 2,
          "swift": 1,
          "frog": 1,
          "gold": 2
        },
        "startingPrey": 6,
        "maximumPrey": 13,
        "spawnDelaySeconds": {
          "min": 0.31,
          "max": 0.61
        }
      },
      "waves": {
        "size": 7,
        "breakSeconds": 3.38
      },
      "hazards": {
        "branches": 5,
        "maximumBats": 7,
        "batSpawnDelaySeconds": {
          "min": 2.04,
          "max": 3.18
        },
        "maximumRivalOwls": 2,
        "rivalOwlSpawnDelaySeconds": {
          "min": 5.2,
          "max": 7.4
        }
      },
      "pickups": {
        "maximumFireflies": 7,
        "fireflySpawnDelaySeconds": {
          "min": 2.2,
          "max": 3.1
        }
      },
      "audio": {
        "chordHz": [
          146.83,
          196,
          233.08
        ]
      }
    },
    {
      "id": "level-13-dunkeltal",
      "order": 13,
      "name": "Dunkeltal",
      "presentation": {
        "theme": "forest",
        "intro": "Das Dunkeltal ist voller schneller Beute und verborgener Äste.",
        "mission": "Sammle 90 Futterpunkte im Nest.",
        "shortMission": "90 Futterpunkte",
        "scenery": {
          "terrain": "deep-forest",
          "trees": [
            "oak",
            "birch",
            "pine"
          ],
          "obstacles": [
            "thorn",
            "trunk",
            "branch"
          ]
        }
      },
      "objective": {
        "type": "foodPoints",
        "target": 90,
        "requiredPrey": null
      },
      "timeBonusSeconds": 26,
      "difficulty": {
        "speedMultiplier": 1.144,
        "timeDrainMultiplier": 1.096,
        "hitPenaltySeconds": 5
      },
      "population": {
        "prey": {
          "normal": 4,
          "beetle": 2,
          "rabbit": 2,
          "swift": 2,
          "frog": 1,
          "gold": 2
        },
        "startingPrey": 6,
        "maximumPrey": 14,
        "spawnDelaySeconds": {
          "min": 0.3,
          "max": 0.6
        }
      },
      "waves": {
        "size": 8,
        "breakSeconds": 3.3
      },
      "hazards": {
        "branches": 6,
        "maximumBats": 8,
        "batSpawnDelaySeconds": {
          "min": 1.96,
          "max": 3.06
        },
        "maximumRivalOwls": 2,
        "rivalOwlSpawnDelaySeconds": {
          "min": 5,
          "max": 7.2
        }
      },
      "pickups": {
        "maximumFireflies": 7,
        "fireflySpawnDelaySeconds": {
          "min": 2.14,
          "max": 3.04
        }
      },
      "audio": {
        "chordHz": [
          174.61,
          220,
          261.63
        ]
      }
    },
    {
      "id": "level-14-fledermaushohle",
      "order": 14,
      "name": "Fledermaushöhle",
      "presentation": {
        "theme": "forest",
        "intro": "Aus der Höhle brechen immer neue Fledermauswellen hervor.",
        "mission": "Sammle 95 Futterpunkte im Nest.",
        "shortMission": "95 Futterpunkte",
        "scenery": {
          "terrain": "deep-forest",
          "trees": [
            "birch",
            "pine",
            "oak"
          ],
          "obstacles": [
            "trunk",
            "branch",
            "thorn"
          ]
        }
      },
      "objective": {
        "type": "foodPoints",
        "target": 95,
        "requiredPrey": null
      },
      "timeBonusSeconds": 27,
      "difficulty": {
        "speedMultiplier": 1.156,
        "timeDrainMultiplier": 1.104,
        "hitPenaltySeconds": 5
      },
      "population": {
        "prey": {
          "normal": 3,
          "beetle": 2,
          "rabbit": 2,
          "swift": 2,
          "frog": 2,
          "gold": 2
        },
        "startingPrey": 6,
        "maximumPrey": 14,
        "spawnDelaySeconds": {
          "min": 0.28,
          "max": 0.58
        }
      },
      "waves": {
        "size": 8,
        "breakSeconds": 3.23
      },
      "hazards": {
        "branches": 6,
        "maximumBats": 8,
        "batSpawnDelaySeconds": {
          "min": 1.88,
          "max": 2.94
        },
        "maximumRivalOwls": 2,
        "rivalOwlSpawnDelaySeconds": {
          "min": 4.8,
          "max": 7
        }
      },
      "pickups": {
        "maximumFireflies": 7,
        "fireflySpawnDelaySeconds": {
          "min": 2.09,
          "max": 2.99
        }
      },
      "audio": {
        "chordHz": [
          174.61,
          220,
          261.63
        ]
      }
    },
    {
      "id": "level-15-geisterwald",
      "order": 15,
      "name": "Geisterwald",
      "presentation": {
        "theme": "mist",
        "intro": "Blasser Dunst verschluckt jede sichere Fluglinie.",
        "mission": "Sammle 100 Futterpunkte im Nest.",
        "shortMission": "100 Futterpunkte",
        "scenery": {
          "terrain": "marsh",
          "trees": [
            "willow",
            "birch",
            "dead"
          ],
          "obstacles": [
            "branch",
            "stump",
            "thorn"
          ]
        }
      },
      "objective": {
        "type": "foodPoints",
        "target": 100,
        "requiredPrey": null
      },
      "timeBonusSeconds": 27,
      "difficulty": {
        "speedMultiplier": 1.168,
        "timeDrainMultiplier": 1.112,
        "hitPenaltySeconds": 5
      },
      "population": {
        "prey": {
          "normal": 3,
          "beetle": 2,
          "rabbit": 2,
          "swift": 2,
          "frog": 2,
          "gold": 2
        },
        "startingPrey": 6,
        "maximumPrey": 14,
        "spawnDelaySeconds": {
          "min": 0.26,
          "max": 0.56
        }
      },
      "waves": {
        "size": 8,
        "breakSeconds": 3.15
      },
      "hazards": {
        "branches": 6,
        "maximumBats": 9,
        "batSpawnDelaySeconds": {
          "min": 1.8,
          "max": 2.82
        },
        "maximumRivalOwls": 2,
        "rivalOwlSpawnDelaySeconds": {
          "min": 4.6,
          "max": 6.8
        }
      },
      "pickups": {
        "maximumFireflies": 8,
        "fireflySpawnDelaySeconds": {
          "min": 2.03,
          "max": 2.93
        }
      },
      "audio": {
        "chordHz": [
          164.81,
          207.65,
          246.94
        ]
      }
    },
    {
      "id": "level-16-silbersee",
      "order": 16,
      "name": "Silbersee",
      "presentation": {
        "theme": "mist",
        "intro": "Über dem Silbersee spiegeln sich Beute und Gefahren im Nebel.",
        "mission": "Sammle 110 Futterpunkte im Nest.",
        "shortMission": "110 Futterpunkte",
        "scenery": {
          "terrain": "marsh",
          "trees": [
            "birch",
            "dead",
            "willow"
          ],
          "obstacles": [
            "stump",
            "thorn",
            "branch"
          ]
        }
      },
      "objective": {
        "type": "foodPoints",
        "target": 110,
        "requiredPrey": null
      },
      "timeBonusSeconds": 28,
      "difficulty": {
        "speedMultiplier": 1.18,
        "timeDrainMultiplier": 1.12,
        "hitPenaltySeconds": 5
      },
      "population": {
        "prey": {
          "normal": 3,
          "beetle": 2,
          "rabbit": 2,
          "swift": 2,
          "frog": 2,
          "gold": 2
        },
        "startingPrey": 7,
        "maximumPrey": 15,
        "spawnDelaySeconds": {
          "min": 0.25,
          "max": 0.55
        }
      },
      "waves": {
        "size": 8,
        "breakSeconds": 3.08
      },
      "hazards": {
        "branches": 7,
        "maximumBats": 9,
        "batSpawnDelaySeconds": {
          "min": 1.73,
          "max": 2.7
        },
        "maximumRivalOwls": 2,
        "rivalOwlSpawnDelaySeconds": {
          "min": 4.4,
          "max": 6.6
        }
      },
      "pickups": {
        "maximumFireflies": 8,
        "fireflySpawnDelaySeconds": {
          "min": 1.98,
          "max": 2.88
        }
      },
      "audio": {
        "chordHz": [
          164.81,
          207.65,
          246.94
        ]
      }
    },
    {
      "id": "level-17-frostwiese",
      "order": 17,
      "name": "Frostwiese",
      "presentation": {
        "theme": "meadow",
        "intro": "Die kalte Frostwiese fordert lange Wege und schnelle Lieferungen.",
        "mission": "Sammle 120 Futterpunkte im Nest.",
        "shortMission": "120 Futterpunkte",
        "scenery": {
          "terrain": "rolling-hills",
          "trees": [
            "oak",
            "birch"
          ],
          "obstacles": [
            "stump",
            "branch"
          ]
        }
      },
      "objective": {
        "type": "foodPoints",
        "target": 120,
        "requiredPrey": null
      },
      "timeBonusSeconds": 29,
      "difficulty": {
        "speedMultiplier": 1.192,
        "timeDrainMultiplier": 1.128,
        "hitPenaltySeconds": 5
      },
      "population": {
        "prey": {
          "normal": 3,
          "beetle": 2,
          "rabbit": 2,
          "swift": 2,
          "frog": 2,
          "gold": 2
        },
        "startingPrey": 7,
        "maximumPrey": 15,
        "spawnDelaySeconds": {
          "min": 0.23,
          "max": 0.53
        }
      },
      "waves": {
        "size": 9,
        "breakSeconds": 3
      },
      "hazards": {
        "branches": 7,
        "maximumBats": 9,
        "batSpawnDelaySeconds": {
          "min": 1.65,
          "max": 2.58
        },
        "maximumRivalOwls": 2,
        "rivalOwlSpawnDelaySeconds": {
          "min": 4.2,
          "max": 6.4
        }
      },
      "pickups": {
        "maximumFireflies": 8,
        "fireflySpawnDelaySeconds": {
          "min": 1.92,
          "max": 2.82
        }
      },
      "audio": {
        "chordHz": [
          196,
          246.94,
          293.66
        ]
      }
    },
    {
      "id": "level-18-schattenbruch",
      "order": 18,
      "name": "Schattenbruch",
      "presentation": {
        "theme": "forest",
        "intro": "Im Schattenbruch wechseln ruhige Momente und dichte Wellen.",
        "mission": "Sammle 130 Futterpunkte im Nest.",
        "shortMission": "130 Futterpunkte",
        "scenery": {
          "terrain": "deep-forest",
          "trees": [
            "pine",
            "oak",
            "birch"
          ],
          "obstacles": [
            "branch",
            "thorn",
            "trunk"
          ]
        }
      },
      "objective": {
        "type": "foodPoints",
        "target": 130,
        "requiredPrey": null
      },
      "timeBonusSeconds": 29,
      "difficulty": {
        "speedMultiplier": 1.204,
        "timeDrainMultiplier": 1.136,
        "hitPenaltySeconds": 5
      },
      "population": {
        "prey": {
          "normal": 3,
          "beetle": 2,
          "rabbit": 2,
          "swift": 2,
          "frog": 2,
          "gold": 2
        },
        "startingPrey": 7,
        "maximumPrey": 15,
        "spawnDelaySeconds": {
          "min": 0.21,
          "max": 0.51
        }
      },
      "waves": {
        "size": 9,
        "breakSeconds": 2.93
      },
      "hazards": {
        "branches": 7,
        "maximumBats": 10,
        "batSpawnDelaySeconds": {
          "min": 1.57,
          "max": 2.46
        },
        "maximumRivalOwls": 3,
        "rivalOwlSpawnDelaySeconds": {
          "min": 4,
          "max": 6.2
        }
      },
      "pickups": {
        "maximumFireflies": 8,
        "fireflySpawnDelaySeconds": {
          "min": 1.87,
          "max": 2.77
        }
      },
      "audio": {
        "chordHz": [
          174.61,
          220,
          261.63
        ]
      }
    },
    {
      "id": "level-19-irrlichtpfad",
      "order": 19,
      "name": "Irrlichtpfad",
      "presentation": {
        "theme": "mist",
        "intro": "Irrlichter locken dich zwischen Äste und schnelle Tiere.",
        "mission": "Sammle 140 Futterpunkte im Nest.",
        "shortMission": "140 Futterpunkte",
        "scenery": {
          "terrain": "marsh",
          "trees": [
            "birch",
            "dead",
            "willow"
          ],
          "obstacles": [
            "stump",
            "thorn",
            "branch"
          ]
        }
      },
      "objective": {
        "type": "foodPoints",
        "target": 140,
        "requiredPrey": null
      },
      "timeBonusSeconds": 30,
      "difficulty": {
        "speedMultiplier": 1.216,
        "timeDrainMultiplier": 1.144,
        "hitPenaltySeconds": 6
      },
      "population": {
        "prey": {
          "normal": 3,
          "beetle": 2,
          "rabbit": 3,
          "swift": 2,
          "frog": 2,
          "gold": 2
        },
        "startingPrey": 7,
        "maximumPrey": 16,
        "spawnDelaySeconds": {
          "min": 0.19,
          "max": 0.49
        }
      },
      "waves": {
        "size": 9,
        "breakSeconds": 2.85
      },
      "hazards": {
        "branches": 8,
        "maximumBats": 10,
        "batSpawnDelaySeconds": {
          "min": 1.5,
          "max": 2.34
        },
        "maximumRivalOwls": 3,
        "rivalOwlSpawnDelaySeconds": {
          "min": 3.8,
          "max": 6
        }
      },
      "pickups": {
        "maximumFireflies": 8,
        "fireflySpawnDelaySeconds": {
          "min": 1.81,
          "max": 2.71
        }
      },
      "audio": {
        "chordHz": [
          164.81,
          207.65,
          246.94
        ]
      }
    },
    {
      "id": "level-20-goldregen",
      "order": 20,
      "name": "Goldregen",
      "presentation": {
        "theme": "gold",
        "intro": "Zwei goldene Mäuse müssen durch den Goldregen getragen werden.",
        "mission": "Sammle 100 Futterpunkte mit goldener Beute.",
        "shortMission": "Gold 100 Punkte",
        "scenery": {
          "terrain": "autumn-hills",
          "trees": [
            "birch",
            "oak"
          ],
          "obstacles": [
            "rock",
            "branch",
            "stump"
          ]
        }
      },
      "objective": {
        "type": "foodPoints",
        "target": 100,
        "requiredPrey": "gold"
      },
      "timeBonusSeconds": 31,
      "difficulty": {
        "speedMultiplier": 1.228,
        "timeDrainMultiplier": 1.152,
        "hitPenaltySeconds": 6
      },
      "population": {
        "prey": {
          "normal": 3,
          "beetle": 2,
          "rabbit": 3,
          "swift": 2,
          "frog": 2,
          "gold": 4
        },
        "startingPrey": 7,
        "maximumPrey": 16,
        "spawnDelaySeconds": {
          "min": 0.18,
          "max": 0.48
        }
      },
      "waves": {
        "size": 9,
        "breakSeconds": 2.78
      },
      "hazards": {
        "branches": 8,
        "maximumBats": 10,
        "batSpawnDelaySeconds": {
          "min": 1.42,
          "max": 2.22
        },
        "maximumRivalOwls": 3,
        "rivalOwlSpawnDelaySeconds": {
          "min": 3.6,
          "max": 5.8
        }
      },
      "pickups": {
        "maximumFireflies": 8,
        "fireflySpawnDelaySeconds": {
          "min": 1.76,
          "max": 2.66
        }
      },
      "audio": {
        "chordHz": [
          220,
          277.18,
          329.63
        ]
      }
    },
    {
      "id": "level-21-donnergrat",
      "order": 21,
      "name": "Donnergrat",
      "presentation": {
        "theme": "storm",
        "intro": "Blitze erhellen am Donnergrat gewaltige Fledermausschwärme.",
        "mission": "Sammle 150 Futterpunkte im Nest.",
        "shortMission": "150 Futterpunkte",
        "scenery": {
          "terrain": "cliffs",
          "trees": [
            "dead",
            "pine"
          ],
          "obstacles": [
            "rock",
            "thorn",
            "trunk"
          ]
        }
      },
      "objective": {
        "type": "foodPoints",
        "target": 150,
        "requiredPrey": null
      },
      "timeBonusSeconds": 31,
      "difficulty": {
        "speedMultiplier": 1.24,
        "timeDrainMultiplier": 1.16,
        "hitPenaltySeconds": 6
      },
      "population": {
        "prey": {
          "normal": 2,
          "beetle": 2,
          "rabbit": 3,
          "swift": 2,
          "frog": 2,
          "gold": 3
        },
        "startingPrey": 8,
        "maximumPrey": 16,
        "spawnDelaySeconds": {
          "min": 0.16,
          "max": 0.46
        }
      },
      "waves": {
        "size": 10,
        "breakSeconds": 2.7
      },
      "hazards": {
        "branches": 8,
        "maximumBats": 11,
        "batSpawnDelaySeconds": {
          "min": 1.34,
          "max": 2.1
        },
        "maximumRivalOwls": 3,
        "rivalOwlSpawnDelaySeconds": {
          "min": 3.4,
          "max": 5.6
        }
      },
      "pickups": {
        "maximumFireflies": 8,
        "fireflySpawnDelaySeconds": {
          "min": 1.7,
          "max": 2.6
        }
      },
      "audio": {
        "chordHz": [
          146.83,
          196,
          233.08
        ]
      }
    },
    {
      "id": "level-22-schwarzer-forst",
      "order": 22,
      "name": "Schwarzer Forst",
      "presentation": {
        "theme": "forest",
        "intro": "Der Schwarze Forst verzeiht kaum einen Zusammenstoß.",
        "mission": "Sammle 160 Futterpunkte im Nest.",
        "shortMission": "160 Futterpunkte",
        "scenery": {
          "terrain": "deep-forest",
          "trees": [
            "oak",
            "birch",
            "pine"
          ],
          "obstacles": [
            "thorn",
            "trunk",
            "branch"
          ]
        }
      },
      "objective": {
        "type": "foodPoints",
        "target": 160,
        "requiredPrey": null
      },
      "timeBonusSeconds": 32,
      "difficulty": {
        "speedMultiplier": 1.252,
        "timeDrainMultiplier": 1.168,
        "hitPenaltySeconds": 6
      },
      "population": {
        "prey": {
          "normal": 2,
          "beetle": 2,
          "rabbit": 3,
          "swift": 2,
          "frog": 2,
          "gold": 3
        },
        "startingPrey": 8,
        "maximumPrey": 17,
        "spawnDelaySeconds": {
          "min": 0.16,
          "max": 0.44
        }
      },
      "waves": {
        "size": 10,
        "breakSeconds": 2.63
      },
      "hazards": {
        "branches": 9,
        "maximumBats": 11,
        "batSpawnDelaySeconds": {
          "min": 1.27,
          "max": 1.98
        },
        "maximumRivalOwls": 3,
        "rivalOwlSpawnDelaySeconds": {
          "min": 3.2,
          "max": 5.4
        }
      },
      "pickups": {
        "maximumFireflies": 9,
        "fireflySpawnDelaySeconds": {
          "min": 1.65,
          "max": 2.54
        }
      },
      "audio": {
        "chordHz": [
          174.61,
          220,
          261.63
        ]
      }
    },
    {
      "id": "level-23-mondsichelmoor",
      "order": 23,
      "name": "Mondsichelmoor",
      "presentation": {
        "theme": "mist",
        "intro": "Im Mondsichelmoor wird die Nacht spürbar kürzer.",
        "mission": "Sammle 170 Futterpunkte im Nest.",
        "shortMission": "170 Futterpunkte",
        "scenery": {
          "terrain": "marsh",
          "trees": [
            "dead",
            "willow",
            "birch"
          ],
          "obstacles": [
            "thorn",
            "branch",
            "stump"
          ]
        }
      },
      "objective": {
        "type": "foodPoints",
        "target": 170,
        "requiredPrey": null
      },
      "timeBonusSeconds": 32,
      "difficulty": {
        "speedMultiplier": 1.264,
        "timeDrainMultiplier": 1.176,
        "hitPenaltySeconds": 6
      },
      "population": {
        "prey": {
          "normal": 2,
          "beetle": 2,
          "rabbit": 3,
          "swift": 3,
          "frog": 3,
          "gold": 3
        },
        "startingPrey": 8,
        "maximumPrey": 17,
        "spawnDelaySeconds": {
          "min": 0.16,
          "max": 0.43
        }
      },
      "waves": {
        "size": 10,
        "breakSeconds": 2.55
      },
      "hazards": {
        "branches": 9,
        "maximumBats": 11,
        "batSpawnDelaySeconds": {
          "min": 1.19,
          "max": 1.86
        },
        "maximumRivalOwls": 3,
        "rivalOwlSpawnDelaySeconds": {
          "min": 3,
          "max": 5.2
        }
      },
      "pickups": {
        "maximumFireflies": 9,
        "fireflySpawnDelaySeconds": {
          "min": 1.59,
          "max": 2.49
        }
      },
      "audio": {
        "chordHz": [
          164.81,
          207.65,
          246.94
        ]
      }
    },
    {
      "id": "level-24-rufschlucht",
      "order": 24,
      "name": "Rufschlucht",
      "presentation": {
        "theme": "storm",
        "intro": "Ein gut getimtes Huuu hält dir in der überfüllten Schlucht den Weg frei.",
        "mission": "Sammle 180 Futterpunkte im Nest.",
        "shortMission": "180 Futterpunkte",
        "scenery": {
          "terrain": "cliffs",
          "trees": [
            "pine",
            "dead"
          ],
          "obstacles": [
            "rock",
            "thorn",
            "trunk"
          ]
        }
      },
      "objective": {
        "type": "foodPoints",
        "target": 180,
        "requiredPrey": null
      },
      "timeBonusSeconds": 33,
      "difficulty": {
        "speedMultiplier": 1.276,
        "timeDrainMultiplier": 1.184,
        "hitPenaltySeconds": 6
      },
      "population": {
        "prey": {
          "normal": 2,
          "beetle": 2,
          "rabbit": 3,
          "swift": 3,
          "frog": 3,
          "gold": 3
        },
        "startingPrey": 8,
        "maximumPrey": 17,
        "spawnDelaySeconds": {
          "min": 0.16,
          "max": 0.41
        }
      },
      "waves": {
        "size": 10,
        "breakSeconds": 2.48
      },
      "hazards": {
        "branches": 9,
        "maximumBats": 12,
        "batSpawnDelaySeconds": {
          "min": 1.11,
          "max": 1.74
        },
        "maximumRivalOwls": 3,
        "rivalOwlSpawnDelaySeconds": {
          "min": 2.8,
          "max": 5
        }
      },
      "pickups": {
        "maximumFireflies": 9,
        "fireflySpawnDelaySeconds": {
          "min": 1.54,
          "max": 2.44
        }
      },
      "audio": {
        "chordHz": [
          146.83,
          196,
          233.08
        ]
      }
    },
    {
      "id": "level-25-dammerhain",
      "order": 25,
      "name": "Dämmerhain",
      "presentation": {
        "theme": "gold",
        "intro": "Die Dämmerung rückt näher und jede Lieferung zählt.",
        "mission": "Sammle 190 Futterpunkte im Nest.",
        "shortMission": "190 Futterpunkte",
        "scenery": {
          "terrain": "autumn-hills",
          "trees": [
            "oak",
            "birch"
          ],
          "obstacles": [
            "stump",
            "rock",
            "branch"
          ]
        }
      },
      "objective": {
        "type": "foodPoints",
        "target": 190,
        "requiredPrey": null
      },
      "timeBonusSeconds": 34,
      "difficulty": {
        "speedMultiplier": 1.288,
        "timeDrainMultiplier": 1.192,
        "hitPenaltySeconds": 7
      },
      "population": {
        "prey": {
          "normal": 2,
          "beetle": 3,
          "rabbit": 3,
          "swift": 3,
          "frog": 3,
          "gold": 4
        },
        "startingPrey": 8,
        "maximumPrey": 18,
        "spawnDelaySeconds": {
          "min": 0.16,
          "max": 0.39
        }
      },
      "waves": {
        "size": 11,
        "breakSeconds": 2.4
      },
      "hazards": {
        "branches": 10,
        "maximumBats": 12,
        "batSpawnDelaySeconds": {
          "min": 1.04,
          "max": 1.62
        },
        "maximumRivalOwls": 4,
        "rivalOwlSpawnDelaySeconds": {
          "min": 2.6,
          "max": 4.8
        }
      },
      "pickups": {
        "maximumFireflies": 9,
        "fireflySpawnDelaySeconds": {
          "min": 1.48,
          "max": 2.38
        }
      },
      "audio": {
        "chordHz": [
          220,
          277.18,
          329.63
        ]
      }
    },
    {
      "id": "level-26-blutmond",
      "order": 26,
      "name": "Blutmond",
      "presentation": {
        "theme": "blood",
        "intro": "Der Blutmond weckt den gesamten Wald zu einer wilden Jagd.",
        "mission": "Sammle 200 Futterpunkte im Nest.",
        "shortMission": "200 Futterpunkte",
        "scenery": {
          "terrain": "deadlands",
          "trees": [
            "dead",
            "pine"
          ],
          "obstacles": [
            "trunk",
            "thorn",
            "rock"
          ]
        }
      },
      "objective": {
        "type": "foodPoints",
        "target": 200,
        "requiredPrey": null
      },
      "timeBonusSeconds": 34,
      "difficulty": {
        "speedMultiplier": 1.3,
        "timeDrainMultiplier": 1.2,
        "hitPenaltySeconds": 7
      },
      "population": {
        "prey": {
          "normal": 2,
          "beetle": 3,
          "rabbit": 3,
          "swift": 3,
          "frog": 3,
          "gold": 4
        },
        "startingPrey": 9,
        "maximumPrey": 18,
        "spawnDelaySeconds": {
          "min": 0.16,
          "max": 0.38
        }
      },
      "waves": {
        "size": 11,
        "breakSeconds": 2.33
      },
      "hazards": {
        "branches": 10,
        "maximumBats": 13,
        "batSpawnDelaySeconds": {
          "min": 0.96,
          "max": 1.5
        },
        "maximumRivalOwls": 4,
        "rivalOwlSpawnDelaySeconds": {
          "min": 2.4,
          "max": 4.6
        }
      },
      "pickups": {
        "maximumFireflies": 9,
        "fireflySpawnDelaySeconds": {
          "min": 1.43,
          "max": 2.33
        }
      },
      "audio": {
        "chordHz": [
          130.81,
          164.81,
          196
        ]
      }
    },
    {
      "id": "level-27-nachtsturm",
      "order": 27,
      "name": "Nachtsturm",
      "presentation": {
        "theme": "storm",
        "intro": "Sturm, Äste und Schwärme treffen ohne Pause aufeinander.",
        "mission": "Sammle 215 Futterpunkte im Nest.",
        "shortMission": "215 Futterpunkte",
        "scenery": {
          "terrain": "cliffs",
          "trees": [
            "dead",
            "pine"
          ],
          "obstacles": [
            "rock",
            "thorn",
            "trunk"
          ]
        }
      },
      "objective": {
        "type": "foodPoints",
        "target": 215,
        "requiredPrey": null
      },
      "timeBonusSeconds": 35,
      "difficulty": {
        "speedMultiplier": 1.312,
        "timeDrainMultiplier": 1.208,
        "hitPenaltySeconds": 7
      },
      "population": {
        "prey": {
          "normal": 2,
          "beetle": 3,
          "rabbit": 3,
          "swift": 3,
          "frog": 3,
          "gold": 4
        },
        "startingPrey": 9,
        "maximumPrey": 18,
        "spawnDelaySeconds": {
          "min": 0.16,
          "max": 0.36
        }
      },
      "waves": {
        "size": 11,
        "breakSeconds": 2.25
      },
      "hazards": {
        "branches": 10,
        "maximumBats": 13,
        "batSpawnDelaySeconds": {
          "min": 0.88,
          "max": 1.38
        },
        "maximumRivalOwls": 4,
        "rivalOwlSpawnDelaySeconds": {
          "min": 2.2,
          "max": 4.4
        }
      },
      "pickups": {
        "maximumFireflies": 9,
        "fireflySpawnDelaySeconds": {
          "min": 1.37,
          "max": 2.27
        }
      },
      "audio": {
        "chordHz": [
          146.83,
          196,
          233.08
        ]
      }
    },
    {
      "id": "level-28-letzte-lichtung",
      "order": 28,
      "name": "Letzte Lichtung",
      "presentation": {
        "theme": "blood",
        "intro": "Auf der letzten Lichtung bleibt kein sicherer Flugweg.",
        "mission": "Sammle 230 Futterpunkte im Nest.",
        "shortMission": "230 Futterpunkte",
        "scenery": {
          "terrain": "deadlands",
          "trees": [
            "dead",
            "pine"
          ],
          "obstacles": [
            "rock",
            "trunk",
            "thorn"
          ]
        }
      },
      "objective": {
        "type": "foodPoints",
        "target": 230,
        "requiredPrey": null
      },
      "timeBonusSeconds": 36,
      "difficulty": {
        "speedMultiplier": 1.324,
        "timeDrainMultiplier": 1.216,
        "hitPenaltySeconds": 7
      },
      "population": {
        "prey": {
          "normal": 1,
          "beetle": 3,
          "rabbit": 4,
          "swift": 3,
          "frog": 3,
          "gold": 4
        },
        "startingPrey": 9,
        "maximumPrey": 19,
        "spawnDelaySeconds": {
          "min": 0.16,
          "max": 0.34
        }
      },
      "waves": {
        "size": 11,
        "breakSeconds": 2.18
      },
      "hazards": {
        "branches": 10,
        "maximumBats": 13,
        "batSpawnDelaySeconds": {
          "min": 0.81,
          "max": 1.26
        },
        "maximumRivalOwls": 4,
        "rivalOwlSpawnDelaySeconds": {
          "min": 2.2,
          "max": 4.2
        }
      },
      "pickups": {
        "maximumFireflies": 9,
        "fireflySpawnDelaySeconds": {
          "min": 1.31,
          "max": 2.21
        }
      },
      "audio": {
        "chordHz": [
          130.81,
          164.81,
          196
        ]
      }
    },
    {
      "id": "level-29-morgengrauen",
      "order": 29,
      "name": "Morgengrauen",
      "presentation": {
        "theme": "gold",
        "intro": "Das erste Licht erscheint bereits über den Baumkronen.",
        "mission": "Sammle 245 Futterpunkte im Nest.",
        "shortMission": "245 Futterpunkte",
        "scenery": {
          "terrain": "autumn-hills",
          "trees": [
            "oak",
            "birch"
          ],
          "obstacles": [
            "rock",
            "branch",
            "stump"
          ]
        }
      },
      "objective": {
        "type": "foodPoints",
        "target": 245,
        "requiredPrey": null
      },
      "timeBonusSeconds": 36,
      "difficulty": {
        "speedMultiplier": 1.336,
        "timeDrainMultiplier": 1.224,
        "hitPenaltySeconds": 7
      },
      "population": {
        "prey": {
          "normal": 1,
          "beetle": 3,
          "rabbit": 4,
          "swift": 3,
          "frog": 3,
          "gold": 4
        },
        "startingPrey": 9,
        "maximumPrey": 19,
        "spawnDelaySeconds": {
          "min": 0.16,
          "max": 0.32
        }
      },
      "waves": {
        "size": 12,
        "breakSeconds": 2.1
      },
      "hazards": {
        "branches": 10,
        "maximumBats": 14,
        "batSpawnDelaySeconds": {
          "min": 0.73,
          "max": 1.14
        },
        "maximumRivalOwls": 4,
        "rivalOwlSpawnDelaySeconds": {
          "min": 2.2,
          "max": 4
        }
      },
      "pickups": {
        "maximumFireflies": 10,
        "fireflySpawnDelaySeconds": {
          "min": 1.26,
          "max": 2.16
        }
      },
      "audio": {
        "chordHz": [
          220,
          277.18,
          329.63
        ]
      }
    },
    {
      "id": "level-30-ewige-nacht",
      "order": 30,
      "name": "Ewige Nacht",
      "presentation": {
        "theme": "blood",
        "intro": "Die schwerste Jagd vereint alle Tiere und Gefahren der Nacht.",
        "mission": "Sammle 260 Futterpunkte im Nest.",
        "shortMission": "260 Futterpunkte",
        "scenery": {
          "terrain": "deadlands",
          "trees": [
            "dead",
            "pine"
          ],
          "obstacles": [
            "thorn",
            "rock",
            "trunk"
          ]
        }
      },
      "objective": {
        "type": "foodPoints",
        "target": 260,
        "requiredPrey": null
      },
      "timeBonusSeconds": 37,
      "difficulty": {
        "speedMultiplier": 1.348,
        "timeDrainMultiplier": 1.232,
        "hitPenaltySeconds": 7
      },
      "population": {
        "prey": {
          "normal": 1,
          "beetle": 3,
          "rabbit": 4,
          "swift": 3,
          "frog": 3,
          "gold": 4
        },
        "startingPrey": 9,
        "maximumPrey": 19,
        "spawnDelaySeconds": {
          "min": 0.16,
          "max": 0.31
        }
      },
      "waves": {
        "size": 12,
        "breakSeconds": 2.05
      },
      "hazards": {
        "branches": 10,
        "maximumBats": 14,
        "batSpawnDelaySeconds": {
          "min": 0.67,
          "max": 1.05
        },
        "maximumRivalOwls": 4,
        "rivalOwlSpawnDelaySeconds": {
          "min": 2.2,
          "max": 3.8
        }
      },
      "pickups": {
        "maximumFireflies": 10,
        "fireflySpawnDelaySeconds": {
          "min": 1.21,
          "max": 2.11
        }
      },
      "audio": {
        "chordHz": [
          130.81,
          164.81,
          196
        ]
      }
    }
  ]
}
;
