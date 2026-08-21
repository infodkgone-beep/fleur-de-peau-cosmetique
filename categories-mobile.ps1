# ============================================================================
#  Fleur de peau Cosmetique - Barre de categories aussi sur mobile
#
#  La barre d'icones de categories sur le bord gauche est maintenant visible
#  sur TOUTES les tailles d'ecran (avant : uniquement PC/grand ecran). Les
#  icones sont un peu plus petites sur mobile, et la barre defile verticalement
#  toute seule si elle est plus haute que l'ecran. L'ancienne grille de
#  categories (avec les cases) a ete retiree puisqu'elle est remplacee partout
#  par la barre.
#
#  Utilisation :
#    1) Clic droit sur ce fichier > "Executer avec PowerShell"
#       (ou dans un terminal PowerShell ouvert a la racine du projet :
#        .\categories-mobile.ps1)
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
aW1wb3J0IExpbmsgZnJvbSAibmV4dC9saW5rIgppbXBvcnQgewogIFNwYXJrbGVzLAogIEZsb3dlcjIsCiAgU3VuLAogIERyb3BsZXRzLAogIFNoaWVsZENo
ZWNrLAogIExlYWYsCiAgU2hvd2VySGVhZCwKICBTcHJheUNhbiwKICBTbWlsZSwKICBQYWxldHRlLAogIFNjaXNzb3JzLAogIHR5cGUgTHVjaWRlSWNvbiwK
fSBmcm9tICJsdWNpZGUtcmVhY3QiCgpjb25zdCBpY29uTWFwOiBSZWNvcmQ8c3RyaW5nLCBMdWNpZGVJY29uPiA9IHsKICBTcGFya2xlcywKICBGbG93ZXIy
LAogIFN1biwKICBEcm9wbGV0cywKICBTaGllbGRDaGVjaywKICBMZWFmLAogIFNob3dlckhlYWQsCiAgU3ByYXlDYW4sCiAgU21pbGUsCiAgUGFsZXR0ZSwK
ICBTY2lzc29ycywKfQoKdHlwZSBDYXRlZ29yeSA9IHsgbmFtZTogc3RyaW5nOyBkZXNjcmlwdGlvbjogc3RyaW5nIHwgbnVsbDsgaWNvbjogc3RyaW5nIHwg
bnVsbCB9CgovKioKICogQmFycmUgZCdpY8O0bmVzIGRlIGNhdMOpZ29yaWVzLCBmaXjDqWUgc3VyIGxlIGJvcmQgZ2F1Y2hlIGRlIGwnw6ljcmFuICh2aXNp
YmxlIGVuIHBlcm1hbmVuY2UsCiAqIG3Dqm1lIGVuIGTDqWZpbGFudCwgc3VyIHRvdXRlcyBsZXMgdGFpbGxlcyBkJ8OpY3JhbiksIHF1aSBzZSBkw6lwbGll
IGhvcml6b250YWxlbWVudCBhdQogKiBzdXJ2b2wvYXBwdWkgcG91ciByw6l2w6lsZXIgbGUgbm9tIGRlIGxhIGNhdMOpZ29yaWUuIETDqWZpbGUgdmVydGlj
YWxlbWVudCBzaSBsYSBsaXN0ZSBlc3QgdHJvcAogKiBsb25ndWUgcG91ciBsYSBoYXV0ZXVyIGRlIGwnw6ljcmFuICh1dGlsZSBzdXIgbW9iaWxlIGF2ZWMg
YmVhdWNvdXAgZGUgY2F0w6lnb3JpZXMpLgogKi8KZXhwb3J0IGZ1bmN0aW9uIENhdGVnb3J5UmFpbCh7IGNhdGVnb3JpZXMgfTogeyBjYXRlZ29yaWVzOiBD
YXRlZ29yeVtdIH0pIHsKICBpZiAoY2F0ZWdvcmllcy5sZW5ndGggPT09IDApIHJldHVybiBudWxsCgogIHJldHVybiAoCiAgICA8ZGl2IGNsYXNzTmFtZT0i
Zml4ZWQgbGVmdC0wIHRvcC0xLzIgei0zMCBmbGV4IG1heC1oLVs4MHZoXSAtdHJhbnNsYXRlLXktMS8yIGZsZXgtY29sIGdhcC0xIG92ZXJmbG93LXktYXV0
byBweS0xIHNtOmdhcC0xLjUiPgogICAgICB7Y2F0ZWdvcmllcy5tYXAoKGNhdCkgPT4gewogICAgICAgIGNvbnN0IEljb24gPSBpY29uTWFwW2NhdC5pY29u
ID8/ICIiXSA/PyBTcGFya2xlcwogICAgICAgIHJldHVybiAoCiAgICAgICAgICA8TGluawogICAgICAgICAgICBrZXk9e2NhdC5uYW1lfQogICAgICAgICAg
ICBocmVmPSIvI2JvdXRpcXVlIgogICAgICAgICAgICBjbGFzc05hbWU9Imdyb3VwIGZsZXggaXRlbXMtY2VudGVyIG92ZXJmbG93LWhpZGRlbiByb3VuZGVk
LXItZnVsbCBiZy1jYXJkIHNoYWRvdy1tZCByaW5nLTEgcmluZy1ib3JkZXIgdHJhbnNpdGlvbi1zaGFkb3cgZHVyYXRpb24tMzAwIGhvdmVyOnNoYWRvdy1s
ZyBhY3RpdmU6c2hhZG93LWxnIgogICAgICAgICAgPgogICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9ImZsZXggaC05IHctOSBmbGV4LXNocmluay0wIGl0
ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciByb3VuZGVkLWZ1bGwgYmctc2Vjb25kYXJ5IHRleHQtcHJpbWFyeSB0cmFuc2l0aW9uLWNvbG9ycyBkdXJhdGlv
bi0zMDAgZ3JvdXAtaG92ZXI6YmctcHJpbWFyeSBncm91cC1ob3Zlcjp0ZXh0LXByaW1hcnktZm9yZWdyb3VuZCBncm91cC1hY3RpdmU6YmctcHJpbWFyeSBn
cm91cC1hY3RpdmU6dGV4dC1wcmltYXJ5LWZvcmVncm91bmQgc206aC0xMSBzbTp3LTExIj4KICAgICAgICAgICAgICA8SWNvbiBjbGFzc05hbWU9ImgtNCB3
LTQgc206aC01IHNtOnctNSIgLz4KICAgICAgICAgICAgPC9zcGFuPgogICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9Im1heC13LTAgb3ZlcmZsb3ctaGlk
ZGVuIHdoaXRlc3BhY2Utbm93cmFwIHRleHQtc20gZm9udC1tZWRpdW0gdGV4dC1mb3JlZ3JvdW5kIHRyYW5zaXRpb24tYWxsIGR1cmF0aW9uLTMwMCBncm91
cC1ob3ZlcjptYXgtdy14cyBncm91cC1ob3ZlcjpweS0yIGdyb3VwLWhvdmVyOnBsLTEgZ3JvdXAtaG92ZXI6cHItNCBncm91cC1hY3RpdmU6bWF4LXcteHMg
Z3JvdXAtYWN0aXZlOnB5LTIgZ3JvdXAtYWN0aXZlOnBsLTEgZ3JvdXAtYWN0aXZlOnByLTQiPgogICAgICAgICAgICAgIHtjYXQubmFtZX0KICAgICAgICAg
ICAgPC9zcGFuPgogICAgICAgICAgPC9MaW5rPgogICAgICAgICkKICAgICAgfSl9CiAgICA8L2Rpdj4KICApCn0K
"@
Write-FileFromBase64 -relativePath "components\category-rail.tsx" -base64Content $b64_0

$b64_1 = @"
aW1wb3J0IHsgQW5ub3VuY2VtZW50QmFyIH0gZnJvbSAiQC9jb21wb25lbnRzL2Fubm91bmNlbWVudC1iYXIiCmltcG9ydCB7IFNpdGVIZWFkZXIgfSBmcm9t
ICJAL2NvbXBvbmVudHMvc2l0ZS1oZWFkZXIiCmltcG9ydCB7IEhlcm8gfSBmcm9tICJAL2NvbXBvbmVudHMvaGVybyIKaW1wb3J0IHsgQmFubmVyQ2Fyb3Vz
ZWwgfSBmcm9tICJAL2NvbXBvbmVudHMvYmFubmVyLWNhcm91c2VsIgppbXBvcnQgeyBDYXRlZ29yeVJhaWwgfSBmcm9tICJAL2NvbXBvbmVudHMvY2F0ZWdv
cnktcmFpbCIKaW1wb3J0IHsgUHJvbW90aW9ucyB9IGZyb20gIkAvY29tcG9uZW50cy9wcm9tb3Rpb25zIgppbXBvcnQgeyBQcm9kdWN0cyB9IGZyb20gIkAv
Y29tcG9uZW50cy9wcm9kdWN0cyIKaW1wb3J0IHsgVHJ1c3RCYW5uZXIgfSBmcm9tICJAL2NvbXBvbmVudHMvdHJ1c3QtYmFubmVyIgppbXBvcnQgeyBXaHlD
aG9vc2VVcyB9IGZyb20gIkAvY29tcG9uZW50cy93aHktY2hvb3NlLXVzIgppbXBvcnQgeyBTaXRlRm9vdGVyIH0gZnJvbSAiQC9jb21wb25lbnRzL3NpdGUt
Zm9vdGVyIgppbXBvcnQgeyBXaGF0c0FwcEZsb2F0IH0gZnJvbSAiQC9jb21wb25lbnRzL3doYXRzYXBwLWZsb2F0IgppbXBvcnQgeyBnZXRBY3RpdmVDYXRl
Z29yaWVzLCBnZXRBY3RpdmVQcm9kdWN0cywgZ2V0U2l0ZVNldHRpbmdzIH0gZnJvbSAiQC9saWIvc3RvcmVmcm9udCIKCmV4cG9ydCBjb25zdCByZXZhbGlk
YXRlID0gNjAKCmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIFBhZ2UoKSB7CiAgY29uc3QgW3Byb2R1Y3RzLCBjYXRlZ29yaWVzLCBzZXR0aW5nc10g
PSBhd2FpdCBQcm9taXNlLmFsbChbCiAgICBnZXRBY3RpdmVQcm9kdWN0cygpLAogICAgZ2V0QWN0aXZlQ2F0ZWdvcmllcygpLAogICAgZ2V0U2l0ZVNldHRp
bmdzKCksCiAgXSkKCiAgcmV0dXJuICgKICAgIDxtYWluIGNsYXNzTmFtZT0ibWluLWgtc2NyZWVuIGJnLWJhY2tncm91bmQiPgogICAgICA8QW5ub3VuY2Vt
ZW50QmFyIGFubm91bmNlbWVudHM9e3NldHRpbmdzLmFubm91bmNlbWVudHN9IC8+CiAgICAgIDxTaXRlSGVhZGVyIC8+CiAgICAgIDxDYXRlZ29yeVJhaWwg
Y2F0ZWdvcmllcz17Y2F0ZWdvcmllc30gLz4KICAgICAgPEhlcm8gLz4KICAgICAgPEJhbm5lckNhcm91c2VsIC8+CiAgICAgIDxQcm9tb3Rpb25zIHdoYXRz
YXBwTnVtYmVyPXtzZXR0aW5ncy53aGF0c2FwcE51bWJlcn0gLz4KICAgICAgPFByb2R1Y3RzIHByb2R1Y3RzPXtwcm9kdWN0c30gd2hhdHNhcHBOdW1iZXI9
e3NldHRpbmdzLndoYXRzYXBwTnVtYmVyfSAvPgogICAgICA8VHJ1c3RCYW5uZXIgLz4KICAgICAgPFdoeUNob29zZVVzIC8+CiAgICAgIDxTaXRlRm9vdGVy
IC8+CiAgICAgIDxXaGF0c0FwcEZsb2F0IHdoYXRzYXBwTnVtYmVyPXtzZXR0aW5ncy53aGF0c2FwcE51bWJlcn0gLz4KICAgIDwvbWFpbj4KICApCn0K
"@
Write-FileFromBase64 -relativePath "app\page.tsx" -base64Content $b64_1

Write-Host ""
Write-Host "Tous les fichiers ont ete ecrits avec succes." -ForegroundColor Green
Write-Host ""

$reponse = Read-Host "Voulez-vous committer et pousser ces changements sur git maintenant ? (o/n)"
if ($reponse -eq "o" -or $reponse -eq "O") {
    Write-Host ""
    Write-Host "Ajout des fichiers a git..." -ForegroundColor Cyan
    git add components/category-rail.tsx app/page.tsx

    Write-Host "Creation du commit..." -ForegroundColor Cyan
    git commit -m "Barre de categories visible aussi sur mobile"

    Write-Host "Envoi vers le depot distant..." -ForegroundColor Cyan
    git push

    Write-Host ""
    Write-Host "Termine ! Vercel va deployer automatiquement les changements." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Les fichiers ont ete ecrits mais AUCUN commit n'a ete fait." -ForegroundColor Yellow
    Write-Host "Pour committer plus tard, executez :" -ForegroundColor Yellow
    Write-Host "  git add ."
    Write-Host "  git commit -m ""Categories mobile"""
    Write-Host "  git push"
}
