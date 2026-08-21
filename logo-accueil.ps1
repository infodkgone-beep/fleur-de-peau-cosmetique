# ============================================================================
#  Fleur de peau Cosmetique - Logo et menu qui ramenent bien a l'accueil
#
#  Corrige le bug : le logo et les liens du menu (Accueil, Promotions,
#  Boutique...) utilisaient des ancres de page ("#accueil") qui ne marchent
#  QUE si on est deja sur la page d'accueil. Depuis une fiche produit ou le
#  panier, cliquer dessus ne faisait rien. Ils naviguent maintenant
#  correctement vers l'accueil depuis n'importe quelle page.
#
#  Utilisation :
#    1) Clic droit sur ce fichier > "Executer avec PowerShell"
#       (ou dans un terminal PowerShell ouvert a la racine du projet :
#        .\logo-accueil.ps1)
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
InVzZSBjbGllbnQiCgppbXBvcnQgeyB1c2VTdGF0ZSB9IGZyb20gInJlYWN0IgppbXBvcnQgSW1hZ2UgZnJvbSAibmV4dC9pbWFnZSIKaW1wb3J0IExpbmsg
ZnJvbSAibmV4dC9saW5rIgppbXBvcnQgeyBNZW51LCBYIH0gZnJvbSAibHVjaWRlLXJlYWN0IgppbXBvcnQgeyBXSEFUU0FQUF9OVU1CRVIgfSBmcm9tICJA
L2xpYi9wcm9kdWN0cyIKaW1wb3J0IHsgQ2FydEJ1dHRvbiB9IGZyb20gIkAvY29tcG9uZW50cy9jYXJ0LWJ1dHRvbiIKCmNvbnN0IG5hdkxpbmtzID0gWwog
IHsgbGFiZWw6ICJBY2N1ZWlsIiwgaHJlZjogIi8jYWNjdWVpbCIgfSwKICB7IGxhYmVsOiAiUHJvbW90aW9ucyIsIGhyZWY6ICIvI3Byb21vdGlvbnMiIH0s
CiAgeyBsYWJlbDogIkJvdXRpcXVlIiwgaHJlZjogIi8jYm91dGlxdWUiIH0sCiAgeyBsYWJlbDogIkNhdMOpZ29yaWVzIiwgaHJlZjogIi8jY2F0ZWdvcmll
cyIgfSwKICB7IGxhYmVsOiAiw4AgcHJvcG9zIiwgaHJlZjogIi8jYS1wcm9wb3MiIH0sCiAgeyBsYWJlbDogIkNvbnRhY3QiLCBocmVmOiAiLyNjb250YWN0
IiB9LApdCgpleHBvcnQgZnVuY3Rpb24gU2l0ZUhlYWRlcigpIHsKICBjb25zdCBbb3Blbiwgc2V0T3Blbl0gPSB1c2VTdGF0ZShmYWxzZSkKCiAgcmV0dXJu
ICgKICAgIDxoZWFkZXIgY2xhc3NOYW1lPSJzdGlja3kgdG9wLTAgei00MCBib3JkZXItYiBib3JkZXItYm9yZGVyLzYwIGJnLWJhY2tncm91bmQvODUgYmFj
a2Ryb3AtYmx1ci1tZCI+CiAgICAgIDxkaXYgY2xhc3NOYW1lPSJteC1hdXRvIGZsZXggbWF4LXctN3hsIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4g
Z2FwLTQgcHgtNCBweS0zIHNtOnB4LTYiPgogICAgICAgIDxMaW5rIGhyZWY9Ii8iIGNsYXNzTmFtZT0iZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIuNSI+CiAg
ICAgICAgICA8c3BhbiBjbGFzc05hbWU9InJlbGF0aXZlIGgtMTEgdy0xMSBvdmVyZmxvdy1oaWRkZW4gcm91bmRlZC1mdWxsIHJpbmctMSByaW5nLWdvbGQv
NTAiPgogICAgICAgICAgICA8SW1hZ2UKICAgICAgICAgICAgICBzcmM9Ii9pbWFnZXMvbG9nby1mbGV1ci1kZS1wZWF1LndlYnAiCiAgICAgICAgICAgICAg
YWx0PSJMb2dvIEZsZXVyIGRlIHBlYXUgQ29zbcOpdGlxdWUiCiAgICAgICAgICAgICAgZmlsbAogICAgICAgICAgICAgIGNsYXNzTmFtZT0ic2NhbGUtWzEu
N10gb2JqZWN0LWNvdmVyIG9iamVjdC10b3AiCiAgICAgICAgICAgIC8+CiAgICAgICAgICA8L3NwYW4+CiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9ImZs
ZXggZmxleC1jb2wgbGVhZGluZy1ub25lIj4KICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSJmb250LXNlcmlmIHRleHQtbGcgZm9udC1ib2xkIHRleHQt
cHJpbWFyeSBzbTp0ZXh0LXhsIj5GbGV1ciBkZSBwZWF1PC9zcGFuPgogICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9InRleHQtWzAuNnJlbV0gZm9udC1t
ZWRpdW0gdXBwZXJjYXNlIHRyYWNraW5nLVswLjM1ZW1dIHRleHQtZ29sZCI+Q29zbcOpdGlxdWU8L3NwYW4+CiAgICAgICAgICA8L3NwYW4+CiAgICAgICAg
PC9MaW5rPgoKICAgICAgICA8bmF2IGNsYXNzTmFtZT0iaGlkZGVuIGl0ZW1zLWNlbnRlciBnYXAtNyBsZzpmbGV4Ij4KICAgICAgICAgIHtuYXZMaW5rcy5t
YXAoKGxpbmspID0+ICgKICAgICAgICAgICAgPExpbmsKICAgICAgICAgICAgICBrZXk9e2xpbmsuaHJlZn0KICAgICAgICAgICAgICBocmVmPXtsaW5rLmhy
ZWZ9CiAgICAgICAgICAgICAgY2xhc3NOYW1lPSJ0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtZm9yZWdyb3VuZC84MCB0cmFuc2l0aW9uLWNvbG9ycyBob3Zl
cjp0ZXh0LXByaW1hcnkiCiAgICAgICAgICAgID4KICAgICAgICAgICAgICB7bGluay5sYWJlbH0KICAgICAgICAgICAgPC9MaW5rPgogICAgICAgICAgKSl9
CiAgICAgICAgPC9uYXY+CgogICAgICAgIDxkaXYgY2xhc3NOYW1lPSJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMiI+CiAgICAgICAgICA8Q2FydEJ1dHRvbiAv
PgogICAgICAgICAgPGEKICAgICAgICAgICAgaHJlZj17YGh0dHBzOi8vd2EubWUvJHtXSEFUU0FQUF9OVU1CRVJ9YH0KICAgICAgICAgICAgdGFyZ2V0PSJf
YmxhbmsiCiAgICAgICAgICAgIHJlbD0ibm9vcGVuZXIgbm9yZWZlcnJlciIKICAgICAgICAgICAgY2xhc3NOYW1lPSJoaWRkZW4gaXRlbXMtY2VudGVyIGdh
cC0yIHJvdW5kZWQtZnVsbCBiZy1wcmltYXJ5IHB4LTQgcHktMiB0ZXh0LXNtIGZvbnQtc2VtaWJvbGQgdGV4dC1wcmltYXJ5LWZvcmVncm91bmQgc2hhZG93
LXNtIHRyYW5zaXRpb24tdHJhbnNmb3JtIGhvdmVyOnNjYWxlLVsxLjAzXSBzbTpmbGV4IgogICAgICAgICAgPgogICAgICAgICAgICA8V2hhdHNBcHBJY29u
IGNsYXNzTmFtZT0iaC00IHctNCIgLz4KICAgICAgICAgICAgV2hhdHNBcHAKICAgICAgICAgIDwvYT4KICAgICAgICAgIDxidXR0b24KICAgICAgICAgICAg
dHlwZT0iYnV0dG9uIgogICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRPcGVuKCh2KSA9PiAhdil9CiAgICAgICAgICAgIGFyaWEtbGFiZWw9Ik91dnJp
ciBsZSBtZW51IgogICAgICAgICAgICBjbGFzc05hbWU9ImZsZXggaC0xMCB3LTEwIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciByb3VuZGVkLWZ1bGwg
dGV4dC1mb3JlZ3JvdW5kLzgwIHRyYW5zaXRpb24tY29sb3JzIGhvdmVyOmJnLXNlY29uZGFyeSBsZzpoaWRkZW4iCiAgICAgICAgICA+CiAgICAgICAgICAg
IHtvcGVuID8gPFggY2xhc3NOYW1lPSJoLTUgdy01IiAvPiA6IDxNZW51IGNsYXNzTmFtZT0iaC01IHctNSIgLz59CiAgICAgICAgICA8L2J1dHRvbj4KICAg
ICAgICA8L2Rpdj4KICAgICAgPC9kaXY+CgogICAgICB7b3BlbiAmJiAoCiAgICAgICAgPG5hdiBjbGFzc05hbWU9ImJvcmRlci10IGJvcmRlci1ib3JkZXIv
NjAgYmctYmFja2dyb3VuZCBweC00IHB5LTMgbGc6aGlkZGVuIj4KICAgICAgICAgIDx1bCBjbGFzc05hbWU9ImZsZXggZmxleC1jb2wiPgogICAgICAgICAg
ICB7bmF2TGlua3MubWFwKChsaW5rKSA9PiAoCiAgICAgICAgICAgICAgPGxpIGtleT17bGluay5ocmVmfT4KICAgICAgICAgICAgICAgIDxMaW5rCiAgICAg
ICAgICAgICAgICAgIGhyZWY9e2xpbmsuaHJlZn0KICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0T3BlbihmYWxzZSl9CiAgICAgICAgICAg
ICAgICAgIGNsYXNzTmFtZT0iYmxvY2sgcm91bmRlZC1sZyBweC0zIHB5LTIuNSB0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtZm9yZWdyb3VuZC84MCB0cmFu
c2l0aW9uLWNvbG9ycyBob3ZlcjpiZy1zZWNvbmRhcnkgaG92ZXI6dGV4dC1wcmltYXJ5IgogICAgICAgICAgICAgICAgPgogICAgICAgICAgICAgICAgICB7
bGluay5sYWJlbH0KICAgICAgICAgICAgICAgIDwvTGluaz4KICAgICAgICAgICAgICA8L2xpPgogICAgICAgICAgICApKX0KICAgICAgICAgIDwvdWw+CiAg
ICAgICAgPC9uYXY+CiAgICAgICl9CiAgICA8L2hlYWRlcj4KICApCn0KCmV4cG9ydCBmdW5jdGlvbiBXaGF0c0FwcEljb24oeyBjbGFzc05hbWUgfTogeyBj
bGFzc05hbWU/OiBzdHJpbmcgfSkgewogIHJldHVybiAoCiAgICA8c3ZnIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzc05h
bWU9e2NsYXNzTmFtZX0gYXJpYS1oaWRkZW49InRydWUiPgogICAgICA8cGF0aCBkPSJNMTcuNDcyIDE0LjM4MmMtLjI5Ny0uMTQ5LTEuNzU4LS44NjctMi4w
My0uOTY3LS4yNzMtLjA5OS0uNDcxLS4xNDgtLjY3LjE1LS4xOTcuMjk3LS43NjcuOTY2LS45NCAxLjE2NC0uMTczLjE5OS0uMzQ3LjIyMy0uNjQ0LjA3NS0u
Mjk3LS4xNS0xLjI1NS0uNDYzLTIuMzktMS40NzUtLjg4My0uNzg4LTEuNDgtMS43NjEtMS42NTMtMi4wNTktLjE3My0uMjk3LS4wMTgtLjQ1OC4xMy0uNjA2
LjEzNC0uMTMzLjI5OC0uMzQ3LjQ0Ni0uNTIuMTQ5LS4xNzQuMTk4LS4yOTguMjk4LS40OTcuMDk5LS4xOTguMDUtLjM3MS0uMDI1LS41Mi0uMDc1LS4xNDkt
LjY2OS0xLjYxMi0uOTE2LTIuMjA3LS4yNDItLjU3OS0uNDg3LS41LS42NjktLjUxLS4xNzMtLjAwOC0uMzcxLS4wMS0uNTctLjAxLS4xOTggMC0uNTIuMDc0
LS43OTIuMzcyLS4yNzIuMjk3LTEuMDQgMS4wMTYtMS4wNCAyLjQ3OSAwIDEuNDYyIDEuMDY1IDIuODc1IDEuMjEzIDMuMDc0LjE0OS4xOTggMi4wOTYgMy4y
IDUuMDc3IDQuNDg3LjcwOS4zMDYgMS4yNjIuNDg5IDEuNjk0LjYyNS43MTIuMjI3IDEuMzYuMTk1IDEuODcyLjExOC41NzEtLjA4NSAxLjc1OC0uNzE5IDIu
MDA2LTEuNDEzLjI0OC0uNjk0LjI0OC0xLjI4OS4xNzMtMS40MTMtLjA3NC0uMTI0LS4yNzItLjE5OC0uNTctLjM0N20tNS40MjEgNy40MDNoLS4wMDRhOS44
NyA5Ljg3IDAgMDEtNS4wMzEtMS4zNzhsLS4zNjEtLjIxNC0zLjc0MS45ODIuOTk4LTMuNjQ4LS4yMzUtLjM3NGE5Ljg2IDkuODYgMCAwMS0xLjUxLTUuMjZj
LjAwMS01LjQ1IDQuNDM2LTkuODg0IDkuODg4LTkuODg0IDIuNjQgMCA1LjEyMiAxLjAzIDYuOTg4IDIuODk4YTkuODI1IDkuODI1IDAgMDEyLjg5MyA2Ljk5
NGMtLjAwMyA1LjQ1LTQuNDM3IDkuODg0LTkuODg1IDkuODg0bTguNDEzLTE4LjI5N0ExMS44MTUgMTEuODE1IDAgMDAxMi4wNSAwQzUuNDk1IDAgLjE2IDUu
MzM1LjE1NyAxMS44OTJjMCAyLjA5Ni41NDcgNC4xNDIgMS41ODggNS45NDVMLjA1NyAyNGw2LjMwNS0xLjY1NGExMS44ODIgMTEuODgyIDAgMDA1LjY4MyAx
LjQ0OGguMDA1YzYuNTU0IDAgMTEuODktNS4zMzUgMTEuODkzLTExLjg5M2ExMS44MjEgMTEuODIxIDAgMDAtMy40OC04LjQxM1oiIC8+CiAgICA8L3N2Zz4K
ICApCn0K
"@
Write-FileFromBase64 -relativePath "components\site-header.tsx" -base64Content $b64_0

Write-Host ""
Write-Host "Tous les fichiers ont ete ecrits avec succes." -ForegroundColor Green
Write-Host ""
Write-Host "Resume des changements :" -ForegroundColor Cyan
Write-Host "  - Corrige : le logo ramene bien a l'accueil depuis n'importe quelle page"
Write-Host "  - Corrige : les liens du menu (Promotions, Boutique...) fonctionnent aussi"
Write-Host "    depuis une fiche produit ou le panier, pas seulement depuis l'accueil"
Write-Host ""

$reponse = Read-Host "Voulez-vous committer et pousser ces changements sur git maintenant ? (o/n)"
if ($reponse -eq "o" -or $reponse -eq "O") {
    Write-Host ""
    Write-Host "Ajout des fichiers a git..." -ForegroundColor Cyan
    git add components/site-header.tsx

    Write-Host "Creation du commit..." -ForegroundColor Cyan
    git commit -m "Corrige le logo et le menu qui ne ramenaient pas a l'accueil depuis les autres pages"

    Write-Host "Envoi vers le depot distant..." -ForegroundColor Cyan
    git push

    Write-Host ""
    Write-Host "Termine ! Vercel va deployer automatiquement les changements." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Les fichiers ont ete ecrits mais AUCUN commit n'a ete fait." -ForegroundColor Yellow
    Write-Host "Pour committer plus tard, executez :" -ForegroundColor Yellow
    Write-Host "  git add ."
    Write-Host "  git commit -m ""Logo et menu vers l'accueil"""
    Write-Host "  git push"
}
