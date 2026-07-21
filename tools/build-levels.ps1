param(
  [string]$ProjectRoot = (Split-Path -Parent $PSScriptRoot)
)

$source = Join-Path $ProjectRoot 'data\levels.json'
$target = Join-Path $ProjectRoot 'js\levels.js'
$json = Get-Content -LiteralPath $source -Raw -Encoding UTF8
$data = $json | ConvertFrom-Json

if ($data.formatVersion -ne 1 -or $data.levels.Count -lt 1) {
  throw 'levels.json hat ein unbekanntes oder leeres Format.'
}

$runtime = "/* Generated from data/levels.json. Run tools/build-levels.ps1 after editing the JSON source. */`nwindow.OWL_LEVEL_DATA = $json;"
Set-Content -LiteralPath $target -Value $runtime -Encoding UTF8
Write-Host "Generated js/levels.js with $($data.levels.Count) levels."

$owlSource = Join-Path $ProjectRoot 'data\owls.json'
$owlTarget = Join-Path $ProjectRoot 'js\owls.js'
$owlJson = Get-Content -LiteralPath $owlSource -Raw -Encoding UTF8
$owlData = $owlJson | ConvertFrom-Json
if ($owlData.formatVersion -ne 1 -or $owlData.owls.Count -lt 1) {
  throw 'owls.json hat ein unbekanntes oder leeres Format.'
}
$requiredFlightFields = @('acceleration','brakeDrag','turnResponse','landingSpeed','perchRecharge')
foreach ($owl in $owlData.owls) {
  if ($null -eq $owl.flight) { throw "Eule $($owl.id): Flugprofil fehlt." }
  $missingFlight = @($requiredFlightFields | Where-Object { $null -eq $owl.flight.$_ })
  if ($missingFlight.Count -gt 0) { throw "Eule $($owl.id): Flugwerte fehlen: $($missingFlight -join ', ')." }
}
$duplicateOwlIds = @($owlData.owls | Group-Object id | Where-Object Count -gt 1)
if ($duplicateOwlIds.Count -gt 0) { throw 'owls.json enthält doppelte Eulen-IDs.' }
$owlRuntime = "/* Generated from data/owls.json. Run tools/build-levels.ps1 after editing the JSON source. */`nwindow.OWL_ROSTER_DATA = $owlJson;"
Set-Content -LiteralPath $owlTarget -Value $owlRuntime -Encoding UTF8
Write-Host "Generated js/owls.js with $($owlData.owls.Count) owls."

$storySource = Join-Path $ProjectRoot 'data\story.json'
$storyTarget = Join-Path $ProjectRoot 'js\story.js'
$storyJson = Get-Content -LiteralPath $storySource -Raw -Encoding UTF8
$storyData = $storyJson | ConvertFrom-Json
if ($storyData.formatVersion -ne 1 -or $storyData.chapters.Count -lt 1) {
  throw 'story.json hat ein unbekanntes oder leeres Format.'
}
foreach ($chapter in $storyData.chapters) {
  if ($chapter.lines.Count -gt 4) { throw "Storykapitel $($chapter.id): Kapitelintro darf höchstens vier Dialogkarten enthalten." }
  foreach ($line in @($chapter.lines) + @($chapter.beats)) {
    if ($null -ne $line -and $null -eq $storyData.characters.$($line.speaker)) { throw "Storykapitel $($chapter.id): unbekannter Sprecher $($line.speaker)." }
  }
}
$storyRuntime = "/* Generated from data/story.json. Run tools/build-levels.ps1 after editing the JSON source. */`nwindow.OWL_STORY_DATA = $storyJson;"
Set-Content -LiteralPath $storyTarget -Value $storyRuntime -Encoding UTF8
Write-Host "Generated js/story.js with $($storyData.chapters.Count) story chapters."

$worldSource = Join-Path $ProjectRoot 'data\worlds\scenes.json'
$worldTarget = Join-Path $ProjectRoot 'js\worlds.js'
$worldJson = Get-Content -LiteralPath $worldSource -Raw -Encoding UTF8
$worldData = $worldJson | ConvertFrom-Json
$requiredWorldFields = @('id','levelId','levelOrder','chapter','sceneType','worldWidth','worldHeight','worldWidthScreens','start','goal','nest','cameraMode','safeBranches','landmarks','storyTriggers','objectives')
if ($worldData.formatVersion -ne 1 -or $worldData.scenes.Count -ne $data.levels.Count) {
  throw 'data/worlds/scenes.json muss genau eine Welt pro Level enthalten.'
}
foreach ($scene in $worldData.scenes) {
  $missing = @($requiredWorldFields | Where-Object { $null -eq $scene.$_ })
  if ($missing.Count -gt 0) { throw "Weltszene $($scene.id): Pflichtfelder fehlen: $($missing -join ', ')." }
  if ($scene.landmarks.Count -lt 2) { throw "Weltszene $($scene.id): mindestens zwei Landmarken erforderlich." }
}
$duplicateWorldIds = @($worldData.scenes | Group-Object id | Where-Object Count -gt 1)
$duplicateWorldOrders = @($worldData.scenes | Group-Object levelOrder | Where-Object Count -gt 1)
if ($duplicateWorldIds.Count -gt 0 -or $duplicateWorldOrders.Count -gt 0) {
  throw 'Weltdaten enthalten doppelte IDs oder Levelnummern.'
}
$knownLevelIds = @($data.levels | ForEach-Object id)
$unknownWorldLevels = @($worldData.scenes | Where-Object { $_.levelId -notin $knownLevelIds })
if ($unknownWorldLevels.Count -gt 0) { throw 'Weltdaten verweisen auf unbekannte Level-IDs.' }
$worldRuntime = "/* Generated from data/worlds/scenes.json. Run tools/build-levels.ps1 after editing the JSON source. */`nwindow.OWL_WORLD_DATA = $worldJson;"
Set-Content -LiteralPath $worldTarget -Value $worldRuntime -Encoding UTF8
Write-Host "Generated js/worlds.js with $($worldData.scenes.Count) horizontal worlds."

$hootSource = Join-Path $ProjectRoot 'data\hoot-contexts.json'
$hootTarget = Join-Path $ProjectRoot 'js\hoot-contexts.js'
$hootJson = Get-Content -LiteralPath $hootSource -Raw -Encoding UTF8
$hootData = $hootJson | ConvertFrom-Json
$allowedHootTypes = @('lightTrail','hiddenObject','calmFireflies','calmFynn','distantSpeaker','leafBurst','fogMarker','finaleChain')
if ($hootData.formatVersion -ne 1 -or $hootData.scenes.Count -ne $data.levels.Count) { throw 'hoot-contexts.json muss genau eine Definition pro Level enthalten.' }
$hootIds = @()
foreach ($scene in $hootData.scenes) {
  if ($null -eq $scene.levelOrder -or $null -eq $scene.levelId -or $null -eq $scene.chapter -or $scene.contexts.Count -lt 1) { throw 'Eine Huuu-Szene besitzt unvollständige Pflichtfelder.' }
  foreach ($context in $scene.contexts) {
    $hootIds += $context.id
    if ($context.type -notin $allowedHootTypes) { throw "Unbekannter Huuu-Kontexttyp: $($context.type)." }
    foreach ($field in @('xRatio','yRatio','radius','icon','color','audioResponse')) { if ($null -eq $context.$field) { throw "Huuu-Kontext $($context.id): $field fehlt." } }
  }
}
if (@($hootIds | Group-Object | Where-Object Count -gt 1).Count -gt 0) { throw 'Huuu-Kontextdaten enthalten doppelte IDs.' }
if (@($hootData.scenes | Group-Object levelOrder | Where-Object Count -gt 1).Count -gt 0) { throw 'Huuu-Kontextdaten enthalten doppelte Levelnummern.' }
$unknownHootLevels = @($hootData.scenes | Where-Object { $_.levelId -notin $knownLevelIds })
if ($unknownHootLevels.Count -gt 0) { throw 'Huuu-Kontextdaten verweisen auf unbekannte Level-IDs.' }
$hootRuntime = "/* Generated from data/hoot-contexts.json. Run tools/build-levels.ps1 after editing the JSON source. */`nwindow.OWL_HOOT_DATA = $hootJson;"
Set-Content -LiteralPath $hootTarget -Value $hootRuntime -Encoding UTF8
Write-Host "Generated js/hoot-contexts.js with $($hootData.scenes.Count) context scenes and $($hootIds.Count) interactions."

$storyEventSource = Join-Path $ProjectRoot 'data\story-events.json'
$storyEventTarget = Join-Path $ProjectRoot 'js\story-events.js'
$storyEventJson = Get-Content -LiteralPath $storyEventSource -Raw -Encoding UTF8
$storyEventData = $storyEventJson | ConvertFrom-Json
$allowedStoryTriggers = @('position','objective','landing','hoot','companionDistance')
$allowedCompanionStates = @('follow','wait','ahead','help','unsure','arrived')
if ($storyEventData.formatVersion -ne 1 -or $storyEventData.scenes.Count -ne $data.levels.Count) { throw 'story-events.json muss genau eine Definition pro Level enthalten.' }
$storyEventIds = @()
$storyEventRequirements = @()
$seenStoryTriggerTypes = @()
foreach ($scene in $storyEventData.scenes) {
  if ($null -eq $scene.levelOrder -or $null -eq $scene.levelId -or $null -eq $scene.chapter -or $null -eq $scene.events -or $null -eq $scene.companions) { throw 'Eine Story-Ereignisszene besitzt unvollständige Pflichtfelder.' }
  $sceneCompanionIds = @($scene.companions | ForEach-Object id)
  $worldScene = $worldData.scenes | Where-Object levelOrder -eq $scene.levelOrder | Select-Object -First 1
  $hootScene = $hootData.scenes | Where-Object levelOrder -eq $scene.levelOrder | Select-Object -First 1
  foreach ($companion in $scene.companions) {
    if ($companion.state -notin $allowedCompanionStates) { throw "Unbekannter Begleiterzustand: $($companion.state)." }
  }
  foreach ($event in $scene.events) {
    $storyEventIds += $event.id
    $seenStoryTriggerTypes += $event.trigger.type
    if ($null -ne $event.requires) { $storyEventRequirements += @($event.requires) }
    if ($event.trigger.type -notin $allowedStoryTriggers) { throw "Unbekannter Storytriggertyp: $($event.trigger.type)." }
    foreach ($field in @('id','speaker','text','once')) { if ($null -eq $event.$field) { throw "Story-Ereignis in Level $($scene.levelOrder): $field fehlt." } }
    if ($null -eq $storyData.characters.$($event.speaker)) { throw "Story-Ereignis $($event.id): unbekannter Sprecher $($event.speaker)." }
    if ($event.trigger.type -eq 'position' -and $null -eq $event.trigger.xRatio) { throw "Story-Ereignis $($event.id): xRatio fehlt." }
    if ($event.trigger.type -eq 'objective' -and $null -eq $event.trigger.progress) { throw "Story-Ereignis $($event.id): progress fehlt." }
    if ($event.trigger.type -eq 'landing' -and $event.trigger.perchId -notin @($worldScene.safeBranches | ForEach-Object id)) { throw "Story-Ereignis $($event.id): unbekannter sicherer Ast." }
    if ($event.trigger.type -eq 'hoot' -and $event.trigger.contextId -notin @($hootScene.contexts | ForEach-Object id)) { throw "Story-Ereignis $($event.id): unbekannter Huuu-Kontext." }
    if ($event.trigger.type -eq 'companionDistance') {
      if ($event.trigger.companion -notin $sceneCompanionIds -or $null -eq $event.trigger.distance -or $event.trigger.comparison -notin @('near','far')) { throw "Story-Ereignis $($event.id): ungültiger Begleiterabstand." }
    }
    if ($null -ne $event.action) {
      if ($event.action.companion -notin $sceneCompanionIds) { throw "Story-Ereignis $($event.id): Aktionsbegleiter fehlt in der Szene." }
      if ($null -ne $event.action.state -and $event.action.state -notin $allowedCompanionStates) { throw "Story-Ereignis $($event.id): unbekannter Aktionszustand." }
    }
  }
}
if (@($storyEventIds | Group-Object | Where-Object Count -gt 1).Count -gt 0) { throw 'Story-Ereignisdaten enthalten doppelte IDs.' }
if (@($storyEventRequirements | Where-Object { $_ -notin $storyEventIds }).Count -gt 0) { throw 'Story-Ereignisdaten enthalten unbekannte Ereignisabhängigkeiten.' }
if (@($allowedStoryTriggers | Where-Object { $_ -notin $seenStoryTriggerTypes }).Count -gt 0) { throw 'Nicht alle vorgesehenen Storytriggertypen werden verwendet.' }
if (@($storyEventData.scenes | Group-Object levelOrder | Where-Object Count -gt 1).Count -gt 0) { throw 'Story-Ereignisdaten enthalten doppelte Levelnummern.' }
$unknownStoryEventLevels = @($storyEventData.scenes | Where-Object { $_.levelId -notin $knownLevelIds })
if ($unknownStoryEventLevels.Count -gt 0) { throw 'Story-Ereignisdaten verweisen auf unbekannte Level-IDs.' }
$storyEventRuntime = "/* Generated from data/story-events.json. Run tools/build-levels.ps1 after editing the JSON source. */`nwindow.OWL_STORY_EVENT_DATA = $storyEventJson;"
Set-Content -LiteralPath $storyEventTarget -Value $storyEventRuntime -Encoding UTF8
Write-Host "Generated js/story-events.js with $($storyEventData.scenes.Count) scenes and $($storyEventIds.Count) events."

$tutorialSource = Join-Path $ProjectRoot 'data\tutorial.json'
$tutorialTarget = Join-Path $ProjectRoot 'js\tutorial.js'
$tutorialJson = Get-Content -LiteralPath $tutorialSource -Raw -Encoding UTF8
$tutorialData = $tutorialJson | ConvertFrom-Json
$allowedTutorialTypes = @('movement','landing','carrying','delivered','hoot')
if ($tutorialData.formatVersion -ne 1 -or $tutorialData.levelOrder -ne 1 -or $tutorialData.packages.Count -ne 3 -or $tutorialData.steps.Count -lt 1) { throw 'tutorial.json hat ein unbekanntes oder unvollständiges Format.' }
$tutorialStepIds = @($tutorialData.steps | ForEach-Object id)
if (@($tutorialStepIds | Group-Object | Where-Object Count -gt 1).Count -gt 0) { throw 'Tutorialdaten enthalten doppelte Schritt-IDs.' }
$tutorialWorld = $worldData.scenes | Where-Object levelOrder -eq $tutorialData.levelOrder | Select-Object -First 1
$tutorialHoot = $hootData.scenes | Where-Object levelOrder -eq $tutorialData.levelOrder | Select-Object -First 1
foreach ($step in $tutorialData.steps) {
  if ($step.type -notin $allowedTutorialTypes -or $null -eq $step.id -or $null -eq $step.icon -or $null -eq $step.text) { throw "Ungültiger Tutorialschritt: $($step.id)." }
  if ($step.type -eq 'landing' -and $step.perchId -notin @($tutorialWorld.safeBranches | ForEach-Object id)) { throw "Tutorialschritt $($step.id): unbekannter sicherer Ast." }
  if ($step.type -eq 'hoot' -and $step.contextId -notin @($tutorialHoot.contexts | ForEach-Object id)) { throw "Tutorialschritt $($step.id): unbekannter Huuu-Kontext." }
}
if (@($allowedTutorialTypes | Where-Object { $_ -notin @($tutorialData.steps | ForEach-Object type) }).Count -gt 0) { throw 'Nicht alle vorgesehenen Tutorialschritttypen werden verwendet.' }
$tutorialRuntime = "/* Generated from data/tutorial.json. Run tools/build-levels.ps1 after editing the JSON source. */`nwindow.OWL_TUTORIAL_DATA = $tutorialJson;"
Set-Content -LiteralPath $tutorialTarget -Value $tutorialRuntime -Encoding UTF8
Write-Host "Generated js/tutorial.js with $($tutorialData.steps.Count) steps and $($tutorialData.packages.Count) supply packages."

$meadowSource = Join-Path $ProjectRoot 'data\meadow-routes.json'
$meadowTarget = Join-Path $ProjectRoot 'js\meadow-routes.js'
$meadowJson = Get-Content -LiteralPath $meadowSource -Raw -Encoding UTF8
$meadowData = $meadowJson | ConvertFrom-Json
if ($meadowData.formatVersion -ne 1 -or $meadowData.scenes.Count -ne 3) { throw 'meadow-routes.json muss genau Level 2 bis 4 definieren.' }
$meadowGateIds = @()
$meadowFindIds = @()
$meadowTypes = @()
foreach ($scene in $meadowData.scenes) {
  if ($scene.levelOrder -notin @(2,3,4) -or $scene.levelId -notin $knownLevelIds) { throw "Wiesenszene $($scene.levelOrder): unbekanntes Level." }
  if ($scene.requirements.routeStages -lt 1 -or $scene.requirements.finds -lt 1) { throw "Wiesenszene $($scene.levelOrder): Abschlussanforderungen fehlen." }
  $stages = @($scene.gates | ForEach-Object stage | Sort-Object -Unique)
  if ($stages.Count -ne $scene.requirements.routeStages -or $stages[0] -ne 1 -or $stages[-1] -ne $scene.requirements.routeStages) { throw "Wiesenszene $($scene.levelOrder): Routenstufen sind nicht lückenlos." }
  foreach ($gate in $scene.gates) { $meadowGateIds += $gate.id; foreach ($field in @('id','stage','xRatio','yRatio','radius')) { if ($null -eq $gate.$field) { throw "Wiesentor: $field fehlt." } } }
  foreach ($find in $scene.finds) { $meadowFindIds += $find.id; $meadowTypes += $find.type; foreach ($field in @('id','type','label','xRatio','yRatio','value','food')) { if ($null -eq $find.$field) { throw "Wiesenfund: $field fehlt." } } }
  if ($scene.finds.Count -lt $scene.requirements.finds) { throw "Wiesenszene $($scene.levelOrder): zu wenige Funde." }
  if ($scene.requirements.mouseEncounter -and $null -eq $scene.mouse) { throw "Wiesenszene $($scene.levelOrder): Mausbegegnung fehlt." }
}
if (@($meadowGateIds | Group-Object | Where-Object Count -gt 1).Count -gt 0 -or @($meadowFindIds | Group-Object | Where-Object Count -gt 1).Count -gt 0) { throw 'Wiesendaten enthalten doppelte IDs.' }
if (@('berry','seed','beetleFind','herb' | Where-Object { $_ -notin $meadowTypes }).Count -gt 0) { throw 'Wiesendaten müssen Beeren, Samen, Käferfunde und Kräuter enthalten.' }
$meadowRuntime = "/* Generated from data/meadow-routes.json. Run tools/build-levels.ps1 after editing the JSON source. */`nwindow.OWL_MEADOW_DATA = $meadowJson;"
Set-Content -LiteralPath $meadowTarget -Value $meadowRuntime -Encoding UTF8
Write-Host "Generated js/meadow-routes.js with $($meadowData.scenes.Count) meadow scenes, $($meadowGateIds.Count) gates and $($meadowFindIds.Count) finds."

$fireflySource = Join-Path $ProjectRoot 'data\firefly-quests.json'
$fireflyTarget = Join-Path $ProjectRoot 'js\firefly-quests.js'
$fireflyJson = Get-Content -LiteralPath $fireflySource -Raw -Encoding UTF8
$fireflyData = $fireflyJson | ConvertFrom-Json
if ($fireflyData.formatVersion -ne 1 -or $fireflyData.scenes.Count -ne 4) { throw 'firefly-quests.json muss genau Level 5 bis 8 definieren.' }
$fireflyLostIds = @()
foreach ($scene in $fireflyData.scenes) {
  if ($scene.levelOrder -notin @(5,6,7,8) -or $scene.levelId -notin $knownLevelIds) { throw "Glühwürmchenszene $($scene.levelOrder): unbekanntes Level." }
  $hootScene = $hootData.scenes | Where-Object levelOrder -eq $scene.levelOrder | Select-Object -First 1
  if ($scene.trailContextIds.Count -lt 2 -or @($scene.trailContextIds | Where-Object { $_ -notin @($hootScene.contexts | ForEach-Object id) }).Count -gt 0) { throw "Glühwürmchenszene $($scene.levelOrder): ungültige Lichtspur." }
  $sequences = @($scene.trailContextIds | ForEach-Object { ($hootScene.contexts | Where-Object id -eq $_ | Select-Object -First 1).sequence })
  $actualSequence = @($sequences | Sort-Object) -join ','
  $expectedSequence = @(1..$scene.trailContextIds.Count) -join ','
  if ($actualSequence -ne $expectedSequence) { throw "Glühwürmchenszene $($scene.levelOrder): Lichtspur ist nicht lückenlos." }
  $fireflyLostIds += $scene.lost.id
  foreach ($field in @('speed','startDistance','followDistance','stopDistance','resumeDistance')) { if ($null -eq $scene.escort.$field) { throw "Glühwürmchenszene $($scene.levelOrder): Begleitwert $field fehlt." } }
  if ($scene.escort.stopDistance -le $scene.escort.resumeDistance -or $scene.field.radius -lt 60) { throw "Glühwürmchenszene $($scene.levelOrder): ungültige Abstands- oder Feldwerte." }
}
if (@($fireflyLostIds | Group-Object | Where-Object Count -gt 1).Count -gt 0) { throw 'Glühwürmchendaten enthalten doppelte Figuren-IDs.' }
$fireflyRuntime = "/* Generated from data/firefly-quests.json. Run tools/build-levels.ps1 after editing the JSON source. */`nwindow.OWL_FIREFLY_QUEST_DATA = $fireflyJson;"
Set-Content -LiteralPath $fireflyTarget -Value $fireflyRuntime -Encoding UTF8
Write-Host "Generated js/firefly-quests.js with $($fireflyData.scenes.Count) quests and $(@($fireflyData.scenes.trailContextIds).Count) trail sections."

$raceSource = Join-Path $ProjectRoot 'data\race-tracks.json'
$raceTarget = Join-Path $ProjectRoot 'js\race-tracks.js'
$raceJson = Get-Content -LiteralPath $raceSource -Raw -Encoding UTF8
$raceData = $raceJson | ConvertFrom-Json
if ($raceData.formatVersion -ne 1 -or $raceData.scenes.Count -ne 4) { throw 'race-tracks.json muss genau Level 9 bis 12 definieren.' }
$raceGateIds = @()
foreach ($scene in $raceData.scenes) {
  if ($scene.levelOrder -notin @(9,10,11,12) -or $scene.levelId -notin $knownLevelIds) { throw "Rennszene $($scene.levelOrder): unbekanntes Level." }
  $stages = @($scene.gates | ForEach-Object stage | Sort-Object -Unique)
  if (($stages -join ',') -ne ((1..$scene.gates.Count) -join ',')) { throw "Rennszene $($scene.levelOrder): Torfolge ist nicht lückenlos." }
  foreach ($gate in $scene.gates) { $raceGateIds += $gate.id; foreach ($field in @('id','stage','xRatio','yRatio','radius')) { if ($null -eq $gate.$field) { throw "Renntor: $field fehlt." } } }
  if ($scene.direction -notin @(-1,1) -or $scene.draft.distance -le $scene.draft.height -or $scene.moth.radius -lt 40) { throw "Rennszene $($scene.levelOrder): ungültige Richtung, Windschatten- oder Falterwerte." }
}
if (@($raceGateIds | Group-Object | Where-Object Count -gt 1).Count -gt 0) { throw 'Renndaten enthalten doppelte Tor-IDs.' }
$raceRuntime = "/* Generated from data/race-tracks.json. Run tools/build-levels.ps1 after editing the JSON source. */`nwindow.OWL_RACE_DATA = $raceJson;"
Set-Content -LiteralPath $raceTarget -Value $raceRuntime -Encoding UTF8
Write-Host "Generated js/race-tracks.js with $($raceData.scenes.Count) races and $($raceGateIds.Count) gates."

$brookSource=Join-Path $ProjectRoot 'data\brook-crossings.json';$brookTarget=Join-Path $ProjectRoot 'js\brook-crossings.js';$brookJson=Get-Content -LiteralPath $brookSource -Raw -Encoding UTF8;$brookData=$brookJson|ConvertFrom-Json
if($brookData.formatVersion -ne 1 -or $brookData.scenes.Count -ne 4){throw 'brook-crossings.json muss Level 13 bis 16 definieren.'};$brookIds=@()
foreach($scene in $brookData.scenes){if($scene.levelOrder -notin @(13,14,15,16)-or $scene.levelId -notin $knownLevelIds){throw 'Ungültige Bachszene.'};if($scene.supplies.Count -ne 3 -or $scene.windows.Count -lt 4){throw 'Bachszene benötigt drei Vorräte und mindestens vier Fenster.'};$brookIds+=@($scene.windows|ForEach-Object id);if($scene.safeRatio -le 0 -or $scene.safeRatio -ge 1){throw 'Ungültiges sicheres Zeitfenster.'}}
if(@($brookIds|Group-Object|Where-Object Count -gt 1).Count){throw 'Doppelte Bachfenster-IDs.'};$brookRuntime="/* Generated from data/brook-crossings.json. */`nwindow.OWL_BROOK_DATA = $brookJson;";Set-Content -LiteralPath $brookTarget -Value $brookRuntime -Encoding UTF8;Write-Host "Generated js/brook-crossings.js with $($brookData.scenes.Count) crossings and $($brookIds.Count) rhythm windows."
