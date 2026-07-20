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

