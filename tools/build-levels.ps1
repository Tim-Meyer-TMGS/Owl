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
$owlRuntime = "/* Generated from data/owls.json. Run tools/build-levels.ps1 after editing the JSON source. */`nwindow.OWL_ROSTER_DATA = $owlJson;"
Set-Content -LiteralPath $owlTarget -Value $owlRuntime -Encoding UTF8
Write-Host "Generated js/owls.js with $($owlData.owls.Count) owls."
