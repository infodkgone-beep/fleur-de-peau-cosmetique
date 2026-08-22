# ============================================================================
#  Fleur de peau Cosmetique - Refermer la categorie en tapant ailleurs
#
#  Quand une icone de categorie est depliee (nom visible) sur mobile, appuyer
#  n'importe ou ailleurs sur la page la referme desormais et revient a l'etat
#  initial (comme au chargement du site).
#
#  Utilisation :
#    1) Clic droit sur ce fichier > "Executer avec PowerShell"
#       (ou dans un terminal PowerShell ouvert a la racine du projet :
#        .\fermer-categorie.ps1)
#    2) Repondre "o" a la question finale pour committer + pousser.
# ============================================================================

$ErrorActionPreference = "Stop"

$repoRoot = Get-Location
Write-Host "Dossier courant : $repoRoot" -ForegroundColor Cyan
Write-Host ""

function Write-FileFromBase64($relativePath, $base64Content) {
    $fullPath = Join-Path $repoRoot $relativePath
    $dir = Split-Path $fullPath -Parent
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    $bytes = [Convert]::FromBase64String($base64Content)
    [System.IO.File]::WriteAllBytes($fullPath, $bytes)
    Write-Host "  OK  $relativePath ($($bytes.Length) octets)" -ForegroundColor Green
}

Write-Host "Ecriture des fichiers..." -ForegroundColor Cyan

$b64_0 = @"
InVzZSBjbGllbnQiCgppbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICJyZWFjdCIKaW1wb3J0IExpbmsgZnJvbSAibmV4dC9s
aW5rIgppbXBvcnQgewogIFNwYXJrbGVzLAogIEZsb3dlcjIsCiAgU3VuLAogIERyb3BsZXRzLAogIFNoaWVsZENoZWNrLAogIExlYWYsCiAgU2hvd2VySGVh
ZCwKICBTcHJheUNhbiwKICBTbWlsZSwKICBQYWxldHRlLAogIFNjaXNzb3JzLAogIHR5cGUgTHVjaWRlSWNvbiwKfSBmcm9tICJsdWNpZGUtcmVhY3QiCgpj
b25zdCBpY29uTWFwOiBSZWNvcmQ8c3RyaW5nLCBMdWNpZGVJY29uPiA9IHsKICBTcGFya2xlcywKICBGbG93ZXIyLAogIFN1biwKICBEcm9wbGV0cywKICBT
aGllbGRDaGVjaywKICBMZWFmLAogIFNob3dlckhlYWQsCiAgU3ByYXlDYW4sCiAgU21pbGUsCiAgUGFsZXR0ZSwKICBTY2lzc29ycywKfQoKdHlwZSBDYXRl
Z29yeSA9IHsgbmFtZTogc3RyaW5nOyBkZXNjcmlwdGlvbjogc3RyaW5nIHwgbnVsbDsgaWNvbjogc3RyaW5nIHwgbnVsbCB9CgovKioKICogQmFycmUgZCdp
Y8O0bmVzIGRlIGNhdMOpZ29yaWVzLCBmaXjDqWUgc3VyIGxlIGJvcmQgZ2F1Y2hlIGRlIGwnw6ljcmFuICh2aXNpYmxlIGVuIHBlcm1hbmVuY2UsCiAqIG3D
qm1lIGVuIGTDqWZpbGFudCwgc3VyIHRvdXRlcyBsZXMgdGFpbGxlcyBkJ8OpY3JhbiksIHF1aSBzZSBkw6lwbGllIGhvcml6b250YWxlbWVudCBwb3VyIHLD
qXbDqWxlcgogKiBsZSBub20gZGUgbGEgY2F0w6lnb3JpZS4gRMOpZmlsZSB2ZXJ0aWNhbGVtZW50IHNpIGxhIGxpc3RlIGVzdCB0cm9wIGxvbmd1ZSBwb3Vy
IGxhIGhhdXRldXIgZGUKICogbCfDqWNyYW4gKHV0aWxlIHN1ciBtb2JpbGUgYXZlYyBiZWF1Y291cCBkZSBjYXTDqWdvcmllcykuCiAqCiAqIENvbXBvcnRl
bWVudCB0YWN0aWxlIChtb2JpbGUvdGFibGV0dGUsIHBhcyBkZSBzb3VyaXMpIDogdW4gcHJlbWllciBhcHB1aSBkw6lwbGllIGwnaWPDtG5lIGV0CiAqIGFm
ZmljaGUgbGUgbm9tIFNBTlMgbmF2aWd1ZXIgOyBpbCBmYXV0IGFwcHV5ZXIgdW5lIHNlY29uZGUgZm9pcyAoc3VyIGwnaWPDtG5lIG1haW50ZW5hbnQKICog
ZMOpcGxpw6llKSBwb3VyIG91dnJpciBsYSBjYXTDqWdvcmllLiBTdXIgc291cmlzIChkZXNrdG9wKSwgbGUgc3Vydm9sIHN1ZmZpdCDDoCByw6l2w6lsZXIg
bGUgbm9tIGV0CiAqIHVuIHNpbXBsZSBjbGljIG91dnJlIGRpcmVjdGVtZW50IGxhIGNhdMOpZ29yaWUsIGNvbW1lIGF2YW50LiBVbiBhcHB1aSBuJ2ltcG9y
dGUgb8O5IGFpbGxldXJzIHN1cgogKiBsYSBwYWdlIHJlZmVybWUgbGEgY2F0w6lnb3JpZSBkw6lwbGnDqWUgZXQgcmV2aWVudCDDoCBsJ8OpdGF0IGluaXRp
YWwgKHJpZW4gZCdvdXZlcnQpLgogKi8KZXhwb3J0IGZ1bmN0aW9uIENhdGVnb3J5UmFpbCh7IGNhdGVnb3JpZXMgfTogeyBjYXRlZ29yaWVzOiBDYXRlZ29y
eVtdIH0pIHsKICBjb25zdCBbaXNUb3VjaCwgc2V0SXNUb3VjaF0gPSB1c2VTdGF0ZShmYWxzZSkKICBjb25zdCBbZXhwYW5kZWRJbmRleCwgc2V0RXhwYW5k
ZWRJbmRleF0gPSB1c2VTdGF0ZTxudW1iZXIgfCBudWxsPihudWxsKQogIGNvbnN0IGNvbnRhaW5lclJlZiA9IHVzZVJlZjxIVE1MRGl2RWxlbWVudD4obnVs
bCkKCiAgdXNlRWZmZWN0KCgpID0+IHsKICAgIHNldElzVG91Y2god2luZG93Lm1hdGNoTWVkaWEoIihob3Zlcjogbm9uZSkiKS5tYXRjaGVzKQogIH0sIFtd
KQoKICB1c2VFZmZlY3QoKCkgPT4gewogICAgaWYgKGV4cGFuZGVkSW5kZXggPT09IG51bGwpIHJldHVybgogICAgZnVuY3Rpb24gaGFuZGxlT3V0c2lkZVBv
aW50ZXIoZTogUG9pbnRlckV2ZW50KSB7CiAgICAgIGlmIChjb250YWluZXJSZWYuY3VycmVudCAmJiAhY29udGFpbmVyUmVmLmN1cnJlbnQuY29udGFpbnMo
ZS50YXJnZXQgYXMgTm9kZSkpIHsKICAgICAgICBzZXRFeHBhbmRlZEluZGV4KG51bGwpCiAgICAgIH0KICAgIH0KICAgIGRvY3VtZW50LmFkZEV2ZW50TGlz
dGVuZXIoInBvaW50ZXJkb3duIiwgaGFuZGxlT3V0c2lkZVBvaW50ZXIpCiAgICByZXR1cm4gKCkgPT4gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigi
cG9pbnRlcmRvd24iLCBoYW5kbGVPdXRzaWRlUG9pbnRlcikKICB9LCBbZXhwYW5kZWRJbmRleF0pCgogIGlmIChjYXRlZ29yaWVzLmxlbmd0aCA9PT0gMCkg
cmV0dXJuIG51bGwKCiAgcmV0dXJuICgKICAgIDxkaXYKICAgICAgcmVmPXtjb250YWluZXJSZWZ9CiAgICAgIGNsYXNzTmFtZT0iZml4ZWQgbGVmdC0wIHRv
cC0xLzIgei0zMCBmbGV4IG1heC1oLVs4MHZoXSAtdHJhbnNsYXRlLXktMS8yIGZsZXgtY29sIGdhcC0xIG92ZXJmbG93LXktYXV0byBweS0xIHNtOmdhcC0x
LjUiCiAgICA+CiAgICAgIHtjYXRlZ29yaWVzLm1hcCgoY2F0LCBpKSA9PiB7CiAgICAgICAgY29uc3QgSWNvbiA9IGljb25NYXBbY2F0Lmljb24gPz8gIiJd
ID8/IFNwYXJrbGVzCiAgICAgICAgY29uc3QgaXNFeHBhbmRlZCA9IGlzVG91Y2ggJiYgZXhwYW5kZWRJbmRleCA9PT0gaQoKICAgICAgICByZXR1cm4gKAog
ICAgICAgICAgPExpbmsKICAgICAgICAgICAga2V5PXtjYXQubmFtZX0KICAgICAgICAgICAgaHJlZj0iLyNib3V0aXF1ZSIKICAgICAgICAgICAgb25DbGlj
az17KGUpID0+IHsKICAgICAgICAgICAgICBpZiAoIWlzVG91Y2gpIHJldHVybgogICAgICAgICAgICAgIGlmIChleHBhbmRlZEluZGV4ICE9PSBpKSB7CiAg
ICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCkKICAgICAgICAgICAgICAgIHNldEV4cGFuZGVkSW5kZXgoaSkKICAgICAgICAgICAgICB9CiAgICAg
ICAgICAgIH19CiAgICAgICAgICAgIGNsYXNzTmFtZT17YGdyb3VwIGZsZXggaXRlbXMtY2VudGVyIG92ZXJmbG93LWhpZGRlbiByb3VuZGVkLXItZnVsbCBi
Zy1jYXJkIHNoYWRvdy1tZCByaW5nLTEgcmluZy1ib3JkZXIgdHJhbnNpdGlvbi1zaGFkb3cgZHVyYXRpb24tMzAwIGhvdmVyOnNoYWRvdy1sZyAkewogICAg
ICAgICAgICAgIGlzRXhwYW5kZWQgPyAic2hhZG93LWxnIiA6ICIiCiAgICAgICAgICAgIH1gfQogICAgICAgICAgPgogICAgICAgICAgICA8c3BhbgogICAg
ICAgICAgICAgIGNsYXNzTmFtZT17YGZsZXggaC05IHctOSBmbGV4LXNocmluay0wIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciByb3VuZGVkLWZ1bGwg
Ymctc2Vjb25kYXJ5IHRleHQtcHJpbWFyeSB0cmFuc2l0aW9uLWNvbG9ycyBkdXJhdGlvbi0zMDAgZ3JvdXAtaG92ZXI6YmctcHJpbWFyeSBncm91cC1ob3Zl
cjp0ZXh0LXByaW1hcnktZm9yZWdyb3VuZCBzbTpoLTExIHNtOnctMTEgJHsKICAgICAgICAgICAgICAgIGlzRXhwYW5kZWQgPyAiYmctcHJpbWFyeSB0ZXh0
LXByaW1hcnktZm9yZWdyb3VuZCIgOiAiIgogICAgICAgICAgICAgIH1gfQogICAgICAgICAgICA+CiAgICAgICAgICAgICAgPEljb24gY2xhc3NOYW1lPSJo
LTQgdy00IHNtOmgtNSBzbTp3LTUiIC8+CiAgICAgICAgICAgIDwvc3Bhbj4KICAgICAgICAgICAgPHNwYW4KICAgICAgICAgICAgICBjbGFzc05hbWU9e2Bt
YXgtdy0wIG92ZXJmbG93LWhpZGRlbiB3aGl0ZXNwYWNlLW5vd3JhcCB0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtZm9yZWdyb3VuZCB0cmFuc2l0aW9uLWFs
bCBkdXJhdGlvbi0zMDAgZ3JvdXAtaG92ZXI6bWF4LXcteHMgZ3JvdXAtaG92ZXI6cHktMiBncm91cC1ob3ZlcjpwbC0xIGdyb3VwLWhvdmVyOnByLTQgJHsK
ICAgICAgICAgICAgICAgIGlzRXhwYW5kZWQgPyAibWF4LXcteHMgcHktMiBwbC0xIHByLTQiIDogIiIKICAgICAgICAgICAgICB9YH0KICAgICAgICAgICAg
PgogICAgICAgICAgICAgIHtjYXQubmFtZX0KICAgICAgICAgICAgPC9zcGFuPgogICAgICAgICAgPC9MaW5rPgogICAgICAgICkKICAgICAgfSl9CiAgICA8
L2Rpdj4KICApCn0K
"@
Write-FileFromBase64 -relativePath "components\category-rail.tsx" -base64Content $b64_0

Write-Host ""
Write-Host "Tous les fichiers ont ete ecrits avec succes." -ForegroundColor Green
Write-Host ""

$reponse = Read-Host "Voulez-vous committer et pousser ces changements sur git maintenant ? (o/n)"
if ($reponse -eq "o" -or $reponse -eq "O") {
    Write-Host ""
    Write-Host "Ajout des fichiers a git..." -ForegroundColor Cyan
    git add components/category-rail.tsx

    Write-Host "Creation du commit..." -ForegroundColor Cyan
    git commit -m "Refermer la categorie depliee quand on tape ailleurs sur la page"

    Write-Host "Envoi vers le depot distant..." -ForegroundColor Cyan
    git push

    Write-Host ""
    Write-Host "Termine ! Vercel va deployer automatiquement les changements." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Les fichiers ont ete ecrits mais AUCUN commit n'a ete fait." -ForegroundColor Yellow
    Write-Host "Pour committer plus tard, executez :" -ForegroundColor Yellow
    Write-Host "  git add ."
    Write-Host "  git commit -m ""Fermer categorie ailleurs"""
    Write-Host "  git push"
}
