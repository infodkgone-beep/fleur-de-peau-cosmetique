$ErrorActionPreference = 'Stop'

function Write-FileFromBase64 {
    param(
        [string]$RelativePath,
        [string]$Base64Content
    )
    $fullPath = Join-Path (Get-Location) $RelativePath
    $dir = Split-Path $fullPath -Parent
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    $bytes = [Convert]::FromBase64String($Base64Content)
    [System.IO.File]::WriteAllBytes($fullPath, $bytes)
    Write-Host "Ecrit : $RelativePath" -ForegroundColor Green
}
$b64_0 = @"
LyoqCiAqIE5vcm1hbGlzZSB1biBudW3DqXJvIGl2b2lyaWVuIHNhaXNpIHBhciB1biBjbGllbnQgKGV4OiAiMDcgMDAgMDAgMDAgMDAiLCAiMDctMDAtMDAt
MDAtMDAiKQogKiB2ZXJzIGxlIGZvcm1hdCBhdHRlbmR1IHBhciBsZXMgbGllbnMgd2EubWUgOiBpbmRpY2F0aWYgcGF5cyBpbmNsdXMsIHVuaXF1ZW1lbnQg
ZGVzIGNoaWZmcmVzLgogKi8KZXhwb3J0IGZ1bmN0aW9uIHRvV2hhdHNBcHBOdW1iZXIocmF3OiBzdHJpbmcpOiBzdHJpbmcgewogIGNvbnN0IGRpZ2l0cyA9
IHJhdy5yZXBsYWNlKC9bXlxkXS9nLCAiIikKICBpZiAoZGlnaXRzLnN0YXJ0c1dpdGgoIjIyNSIpKSByZXR1cm4gZGlnaXRzCiAgcmV0dXJuIGAyMjUke2Rp
Z2l0c31gCn0K
"@

Write-Host 'Application du correctif WhatsApp (numero de telephone)...' -ForegroundColor Cyan
Write-FileFromBase64 -RelativePath "lib/phone.ts" -Base64Content $b64_0

Write-Host ""
Write-Host "Correctif applique avec succes !" -ForegroundColor Green
Write-Host "Fichier corrige : lib/phone.ts (format du numero WhatsApp client)" -ForegroundColor Green
Write-Host ""
$confirm = Read-Host "Voulez-vous faire git add / commit / push maintenant ? (o/n)"
if ($confirm -eq 'o' -or $confirm -eq 'O') {
    git add lib/phone.ts
    git commit -m "Fix: corrige le formatage du numero WhatsApp client (le 0 ne doit pas etre supprime)"
    git push
    Write-Host "Pousse sur Git avec succes !" -ForegroundColor Green
} else {
    Write-Host "Pas de push. Vous pouvez le faire plus tard avec : git add lib/phone.ts ; git commit -m '...' ; git push" -ForegroundColor Yellow
}
