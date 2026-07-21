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
