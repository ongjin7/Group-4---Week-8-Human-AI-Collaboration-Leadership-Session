# Exports the deck to exports/deck.pdf (one 16:9 page per slide, every step revealed).
# The local server must be running first:  powershell -ExecutionPolicy Bypass -File tools/serve.ps1
# Usage:  powershell -ExecutionPolicy Bypass -File tools/export-pdf.ps1 [-Port 5173]
param([int]$Port = 5173)

$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$out = Join-Path $root 'exports\deck.pdf'
New-Item -ItemType Directory -Force (Split-Path $out) | Out-Null
$browser = @(
  'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
  'C:\Program Files\Microsoft\Edge\Application\msedge.exe',
  'C:\Program Files\Google\Chrome\Application\chrome.exe'
) | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $browser) { throw 'Edge or Chrome not found. Open the deck and use Print > Save as PDF instead.' }
$profileDir = Join-Path $env:TEMP 'g4w8-pdf-profile'
$p = Start-Process -FilePath $browser -PassThru -Wait -NoNewWindow -ArgumentList @(
  '--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--virtual-time-budget=8000',
  "--print-to-pdf=$out", "--user-data-dir=$profileDir", "http://localhost:$Port/?mode=present"
)
if (Test-Path $out) { Write-Host "Saved $out" } else { Write-Error "Export failed (exit $($p.ExitCode)). Is the server running on port $Port?" }
