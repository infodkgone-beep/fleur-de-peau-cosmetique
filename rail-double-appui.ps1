# ============================================================================
#  Fleur de peau Cosmetique - Double-appui categories + ordre mobile
#
#  Ce que ce script change :
#   - Sur mobile/tablette (tactile) : un premier appui sur une icone de
#     categorie deplie le nom SANS ouvrir la page, il reste affiche ; il faut
#     appuyer une 2e fois pour ouvrir la categorie. Sur PC (souris), rien ne
#     change : le survol suffit et un clic ouvre directement.
#   - Sur mobile/tablette uniquement : le bloc "Nos produits phares" s'affiche
#     maintenant AVANT le bloc "Nos promotions". Sur PC, l'ordre reste
#     Promotions puis Produits comme avant.
#
#  Utilisation :
#    1) Clic droit sur ce fichier > "Executer avec PowerShell"
#       (ou dans un terminal PowerShell ouvert a la racine du projet :
#        .\rail-double-appui.ps1)
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
InVzZSBjbGllbnQiCgppbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAicmVhY3QiCmltcG9ydCBMaW5rIGZyb20gIm5leHQvbGluayIKaW1w
b3J0IHsKICBTcGFya2xlcywKICBGbG93ZXIyLAogIFN1biwKICBEcm9wbGV0cywKICBTaGllbGRDaGVjaywKICBMZWFmLAogIFNob3dlckhlYWQsCiAgU3By
YXlDYW4sCiAgU21pbGUsCiAgUGFsZXR0ZSwKICBTY2lzc29ycywKICB0eXBlIEx1Y2lkZUljb24sCn0gZnJvbSAibHVjaWRlLXJlYWN0IgoKY29uc3QgaWNv
bk1hcDogUmVjb3JkPHN0cmluZywgTHVjaWRlSWNvbj4gPSB7CiAgU3BhcmtsZXMsCiAgRmxvd2VyMiwKICBTdW4sCiAgRHJvcGxldHMsCiAgU2hpZWxkQ2hl
Y2ssCiAgTGVhZiwKICBTaG93ZXJIZWFkLAogIFNwcmF5Q2FuLAogIFNtaWxlLAogIFBhbGV0dGUsCiAgU2Npc3NvcnMsCn0KCnR5cGUgQ2F0ZWdvcnkgPSB7
IG5hbWU6IHN0cmluZzsgZGVzY3JpcHRpb246IHN0cmluZyB8IG51bGw7IGljb246IHN0cmluZyB8IG51bGwgfQoKLyoqCiAqIEJhcnJlIGQnaWPDtG5lcyBk
ZSBjYXTDqWdvcmllcywgZml4w6llIHN1ciBsZSBib3JkIGdhdWNoZSBkZSBsJ8OpY3JhbiAodmlzaWJsZSBlbiBwZXJtYW5lbmNlLAogKiBtw6ptZSBlbiBk
w6lmaWxhbnQsIHN1ciB0b3V0ZXMgbGVzIHRhaWxsZXMgZCfDqWNyYW4pLCBxdWkgc2UgZMOpcGxpZSBob3Jpem9udGFsZW1lbnQgcG91ciByw6l2w6lsZXIK
ICogbGUgbm9tIGRlIGxhIGNhdMOpZ29yaWUuIETDqWZpbGUgdmVydGljYWxlbWVudCBzaSBsYSBsaXN0ZSBlc3QgdHJvcCBsb25ndWUgcG91ciBsYSBoYXV0
ZXVyIGRlCiAqIGwnw6ljcmFuICh1dGlsZSBzdXIgbW9iaWxlIGF2ZWMgYmVhdWNvdXAgZGUgY2F0w6lnb3JpZXMpLgogKgogKiBDb21wb3J0ZW1lbnQgdGFj
dGlsZSAobW9iaWxlL3RhYmxldHRlLCBwYXMgZGUgc291cmlzKSA6IHVuIHByZW1pZXIgYXBwdWkgZMOpcGxpZSBsJ2ljw7RuZSBldAogKiBhZmZpY2hlIGxl
IG5vbSBTQU5TIG5hdmlndWVyIDsgaWwgZmF1dCBhcHB1eWVyIHVuZSBzZWNvbmRlIGZvaXMgKHN1ciBsJ2ljw7RuZSBtYWludGVuYW50CiAqIGTDqXBsacOp
ZSkgcG91ciBvdXZyaXIgbGEgY2F0w6lnb3JpZS4gU3VyIHNvdXJpcyAoZGVza3RvcCksIGxlIHN1cnZvbCBzdWZmaXQgw6AgcsOpdsOpbGVyIGxlIG5vbSBl
dAogKiB1biBzaW1wbGUgY2xpYyBvdXZyZSBkaXJlY3RlbWVudCBsYSBjYXTDqWdvcmllLCBjb21tZSBhdmFudC4KICovCmV4cG9ydCBmdW5jdGlvbiBDYXRl
Z29yeVJhaWwoeyBjYXRlZ29yaWVzIH06IHsgY2F0ZWdvcmllczogQ2F0ZWdvcnlbXSB9KSB7CiAgY29uc3QgW2lzVG91Y2gsIHNldElzVG91Y2hdID0gdXNl
U3RhdGUoZmFsc2UpCiAgY29uc3QgW2V4cGFuZGVkSW5kZXgsIHNldEV4cGFuZGVkSW5kZXhdID0gdXNlU3RhdGU8bnVtYmVyIHwgbnVsbD4obnVsbCkKCiAg
dXNlRWZmZWN0KCgpID0+IHsKICAgIHNldElzVG91Y2god2luZG93Lm1hdGNoTWVkaWEoIihob3Zlcjogbm9uZSkiKS5tYXRjaGVzKQogIH0sIFtdKQoKICBp
ZiAoY2F0ZWdvcmllcy5sZW5ndGggPT09IDApIHJldHVybiBudWxsCgogIHJldHVybiAoCiAgICA8ZGl2IGNsYXNzTmFtZT0iZml4ZWQgbGVmdC0wIHRvcC0x
LzIgei0zMCBmbGV4IG1heC1oLVs4MHZoXSAtdHJhbnNsYXRlLXktMS8yIGZsZXgtY29sIGdhcC0xIG92ZXJmbG93LXktYXV0byBweS0xIHNtOmdhcC0xLjUi
PgogICAgICB7Y2F0ZWdvcmllcy5tYXAoKGNhdCwgaSkgPT4gewogICAgICAgIGNvbnN0IEljb24gPSBpY29uTWFwW2NhdC5pY29uID8/ICIiXSA/PyBTcGFy
a2xlcwogICAgICAgIGNvbnN0IGlzRXhwYW5kZWQgPSBpc1RvdWNoICYmIGV4cGFuZGVkSW5kZXggPT09IGkKCiAgICAgICAgcmV0dXJuICgKICAgICAgICAg
IDxMaW5rCiAgICAgICAgICAgIGtleT17Y2F0Lm5hbWV9CiAgICAgICAgICAgIGhyZWY9Ii8jYm91dGlxdWUiCiAgICAgICAgICAgIG9uQ2xpY2s9eyhlKSA9
PiB7CiAgICAgICAgICAgICAgaWYgKCFpc1RvdWNoKSByZXR1cm4KICAgICAgICAgICAgICBpZiAoZXhwYW5kZWRJbmRleCAhPT0gaSkgewogICAgICAgICAg
ICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpCiAgICAgICAgICAgICAgICBzZXRFeHBhbmRlZEluZGV4KGkpCiAgICAgICAgICAgICAgfQogICAgICAgICAgICB9
fQogICAgICAgICAgICBjbGFzc05hbWU9e2Bncm91cCBmbGV4IGl0ZW1zLWNlbnRlciBvdmVyZmxvdy1oaWRkZW4gcm91bmRlZC1yLWZ1bGwgYmctY2FyZCBz
aGFkb3ctbWQgcmluZy0xIHJpbmctYm9yZGVyIHRyYW5zaXRpb24tc2hhZG93IGR1cmF0aW9uLTMwMCBob3ZlcjpzaGFkb3ctbGcgJHsKICAgICAgICAgICAg
ICBpc0V4cGFuZGVkID8gInNoYWRvdy1sZyIgOiAiIgogICAgICAgICAgICB9YH0KICAgICAgICAgID4KICAgICAgICAgICAgPHNwYW4KICAgICAgICAgICAg
ICBjbGFzc05hbWU9e2BmbGV4IGgtOSB3LTkgZmxleC1zaHJpbmstMCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcm91bmRlZC1mdWxsIGJnLXNlY29u
ZGFyeSB0ZXh0LXByaW1hcnkgdHJhbnNpdGlvbi1jb2xvcnMgZHVyYXRpb24tMzAwIGdyb3VwLWhvdmVyOmJnLXByaW1hcnkgZ3JvdXAtaG92ZXI6dGV4dC1w
cmltYXJ5LWZvcmVncm91bmQgc206aC0xMSBzbTp3LTExICR7CiAgICAgICAgICAgICAgICBpc0V4cGFuZGVkID8gImJnLXByaW1hcnkgdGV4dC1wcmltYXJ5
LWZvcmVncm91bmQiIDogIiIKICAgICAgICAgICAgICB9YH0KICAgICAgICAgICAgPgogICAgICAgICAgICAgIDxJY29uIGNsYXNzTmFtZT0iaC00IHctNCBz
bTpoLTUgc206dy01IiAvPgogICAgICAgICAgICA8L3NwYW4+CiAgICAgICAgICAgIDxzcGFuCiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgbWF4LXctMCBv
dmVyZmxvdy1oaWRkZW4gd2hpdGVzcGFjZS1ub3dyYXAgdGV4dC1zbSBmb250LW1lZGl1bSB0ZXh0LWZvcmVncm91bmQgdHJhbnNpdGlvbi1hbGwgZHVyYXRp
b24tMzAwIGdyb3VwLWhvdmVyOm1heC13LXhzIGdyb3VwLWhvdmVyOnB5LTIgZ3JvdXAtaG92ZXI6cGwtMSBncm91cC1ob3Zlcjpwci00ICR7CiAgICAgICAg
ICAgICAgICBpc0V4cGFuZGVkID8gIm1heC13LXhzIHB5LTIgcGwtMSBwci00IiA6ICIiCiAgICAgICAgICAgICAgfWB9CiAgICAgICAgICAgID4KICAgICAg
ICAgICAgICB7Y2F0Lm5hbWV9CiAgICAgICAgICAgIDwvc3Bhbj4KICAgICAgICAgIDwvTGluaz4KICAgICAgICApCiAgICAgIH0pfQogICAgPC9kaXY+CiAg
KQp9Cg==
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
Y2F0ZWdvcmllcz17Y2F0ZWdvcmllc30gLz4KICAgICAgPEhlcm8gLz4KICAgICAgPEJhbm5lckNhcm91c2VsIC8+CiAgICAgIDxkaXYgY2xhc3NOYW1lPSJm
bGV4IGZsZXgtY29sIj4KICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ib3JkZXItMiBsZzpvcmRlci0xIj4KICAgICAgICAgIDxQcm9tb3Rpb25zIHdoYXRzYXBw
TnVtYmVyPXtzZXR0aW5ncy53aGF0c2FwcE51bWJlcn0gLz4KICAgICAgICA8L2Rpdj4KICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ib3JkZXItMSBsZzpvcmRl
ci0yIj4KICAgICAgICAgIDxQcm9kdWN0cyBwcm9kdWN0cz17cHJvZHVjdHN9IHdoYXRzYXBwTnVtYmVyPXtzZXR0aW5ncy53aGF0c2FwcE51bWJlcn0gLz4K
ICAgICAgICA8L2Rpdj4KICAgICAgPC9kaXY+CiAgICAgIDxUcnVzdEJhbm5lciAvPgogICAgICA8V2h5Q2hvb3NlVXMgLz4KICAgICAgPFNpdGVGb290ZXIg
Lz4KICAgICAgPFdoYXRzQXBwRmxvYXQgd2hhdHNhcHBOdW1iZXI9e3NldHRpbmdzLndoYXRzYXBwTnVtYmVyfSAvPgogICAgPC9tYWluPgogICkKfQo=
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
    git commit -m "Double-appui pour ouvrir une categorie sur mobile + produits avant promotions sur mobile"

    Write-Host "Envoi vers le depot distant..." -ForegroundColor Cyan
    git push

    Write-Host ""
    Write-Host "Termine ! Vercel va deployer automatiquement les changements." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Les fichiers ont ete ecrits mais AUCUN commit n'a ete fait." -ForegroundColor Yellow
    Write-Host "Pour committer plus tard, executez :" -ForegroundColor Yellow
    Write-Host "  git add ."
    Write-Host "  git commit -m ""Double-appui categories + ordre mobile"""
    Write-Host "  git push"
}
