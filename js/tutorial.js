/* Generated from data/tutorial.json. Run tools/build-levels.ps1 after editing the JSON source. */
window.OWL_TUTORIAL_DATA = {
  "formatVersion": 1,
  "levelOrder": 1,
  "levelId": "level-01-wiesenrand",
  "packages": [
    {"id":"bundle-a","xRatio":0.31,"yRatio":0.68,"color":"#e2b56f"},
    {"id":"bundle-b","xRatio":0.57,"yRatio":0.66,"color":"#d99a68"},
    {"id":"bundle-c","xRatio":0.79,"yRatio":0.67,"color":"#c9b47a"}
  ],
  "steps": [
    {"id":"tutorial-flight","type":"movement","distance":170,"icon":"feather","label":"Fliegen","text":"Lenke Lumi ein Stück über die Wiese."},
    {"id":"tutorial-land","type":"landing","perchId":"safe-1-a","icon":"perch","label":"Landen","text":"Tippe den hell markierten Ast an."},
    {"id":"tutorial-carry","type":"carrying","itemType":"bundle","icon":"bolt","label":"Aufheben","text":"Sturzflug auf das erste Vorratspäckchen.","action":{"companion":"fynn","state":"follow"}},
    {"id":"tutorial-deliver","type":"delivered","target":1,"icon":"nest","label":"Nest","text":"Bring das Päckchen zu den hungrigen Eulenkindern."},
    {"id":"tutorial-hoot","type":"hoot","contextId":"hoot-01-leaves","icon":"hoot","label":"Huuu","text":"Rufe beim raschelnden Blätterhaufen."},
    {"id":"tutorial-supplies","type":"delivered","target":3,"icon":"nest","label":"Vorräte","text":"Sammle auch die zwei übrigen Päckchen."}
  ],
  "cinematic": {"duration":4.6,"windAt":1.0,"returnAt":3.35}
}
;
