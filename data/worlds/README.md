# Horizontale Weltdaten

`scenes.json` enthält genau eine Weltdefinition für jedes Level. Koordinaten beziehen sich auf das Referenzformat 900 × 900 und werden vom World-Loader auf das aktuelle Querformat skaliert.

Verbindliche Felder je Szene:

- `id`, `levelId`, `levelOrder`, `chapter`, `sceneType`
- `worldWidth`, `worldHeight`, `worldWidthScreens`
- `start`, `goal`, `nest`
- `cameraMode`
- `safeBranches`, `landmarks`, `storyTriggers`, `objectives`

`worldWidthScreens` bestimmt die tatsächliche horizontale Ausdehnung und liegt zwischen drei und sechs sichtbaren Bildschirmbreiten. Jede Szene besitzt mindestens zwei Landmarken. Das Build-Skript verweigert fehlende Felder, doppelte IDs und unbekannte Levelverweise.

