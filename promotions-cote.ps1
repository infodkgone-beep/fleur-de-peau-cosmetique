# ============================================================================
#  Fleur de peau Cosmetique - Titre "Offres du moment" sur le cote
#
#  Deplace le titre/texte de la section Promotions sur le cote gauche (au lieu
#  d'etre centre au-dessus), pour laisser plus de place aux cartes de
#  promotions a droite.
#
#  Utilisation :
#    1) Clic droit sur ce fichier > "Executer avec PowerShell"
#       (ou dans un terminal PowerShell ouvert a la racine du projet :
#        .\promotions-cote.ps1)
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
aW1wb3J0IHsgVGFnLCBUcnVjaywgR2lmdCB9IGZyb20gImx1Y2lkZS1yZWFjdCIKaW1wb3J0IHsgV2hhdHNBcHBJY29uIH0gZnJvbSAiQC9jb21wb25lbnRz
L3NpdGUtaGVhZGVyIgppbXBvcnQgeyBwcm9tb3Rpb25zLCBXSEFUU0FQUF9OVU1CRVIgYXMgREVGQVVMVF9XSEFUU0FQUF9OVU1CRVIgfSBmcm9tICJAL2xp
Yi9wcm9kdWN0cyIKCmNvbnN0IGljb25zID0gW1RhZywgVHJ1Y2ssIEdpZnRdCgpmdW5jdGlvbiB3aGF0c2FwcExpbmsobnVtYmVyOiBzdHJpbmcsIHRpdGxl
OiBzdHJpbmcsIGNvZGU/OiBzdHJpbmcpIHsKICBjb25zdCBtZXNzYWdlID0KICAgIGBCb25qb3VyIEZsZXVyIGRlIHBlYXUgQ29zbcOpdGlxdWUgISBKZSBz
dWlzIGludMOpcmVzc8OpKGUpIHBhciBsYSBwcm9tb3Rpb24gOiAke3RpdGxlfS5gICsKICAgIChjb2RlID8gYFxuQ29kZSBwcm9tbyA6ICR7Y29kZX1gIDog
IiIpCiAgcmV0dXJuIGBodHRwczovL3dhLm1lLyR7bnVtYmVyfT90ZXh0PSR7ZW5jb2RlVVJJQ29tcG9uZW50KG1lc3NhZ2UpfWAKfQoKZXhwb3J0IGZ1bmN0
aW9uIFByb21vdGlvbnMoeyB3aGF0c2FwcE51bWJlciA9IERFRkFVTFRfV0hBVFNBUFBfTlVNQkVSIH06IHsgd2hhdHNhcHBOdW1iZXI/OiBzdHJpbmcgfSkg
ewogIHJldHVybiAoCiAgICA8c2VjdGlvbiBpZD0icHJvbW90aW9ucyIgY2xhc3NOYW1lPSJiZy1iYWNrZ3JvdW5kIHB5LTE0IG1kOnB5LTIwIj4KICAgICAg
PGRpdiBjbGFzc05hbWU9Im14LWF1dG8gbWF4LXctN3hsIHB4LTQgc206cHgtNiI+CiAgICAgICAgPGRpdiBjbGFzc05hbWU9ImZsZXggZmxleC1jb2wgZ2Fw
LTggbGc6ZmxleC1yb3cgbGc6aXRlbXMtc3RhcnQiPgogICAgICAgICAgPGRpdiBjbGFzc05hbWU9ImxnOnctNzIgbGc6ZmxleC1zaHJpbmstMCI+CiAgICAg
ICAgICAgIDxzcGFuIGNsYXNzTmFtZT0iaW5saW5lLWZsZXggaXRlbXMtY2VudGVyIGdhcC0yIHJvdW5kZWQtZnVsbCBiZy1nb2xkLzIwIHB4LTQgcHktMS41
IHRleHQteHMgZm9udC1ib2xkIHVwcGVyY2FzZSB0cmFja2luZy1bMC4yNWVtXSB0ZXh0LWdvbGQtZm9yZWdyb3VuZCI+CiAgICAgICAgICAgICAgPFRhZyBj
bGFzc05hbWU9ImgtMy41IHctMy41IiAvPgogICAgICAgICAgICAgIE9mZnJlcyBkdSBtb21lbnQKICAgICAgICAgICAgPC9zcGFuPgogICAgICAgICAgICA8
aDIgY2xhc3NOYW1lPSJtdC00IHRleHQtYmFsYW5jZSBmb250LXNlcmlmIHRleHQtM3hsIGZvbnQtYm9sZCB0ZXh0LWZvcmVncm91bmQgc206dGV4dC00eGwi
PgogICAgICAgICAgICAgIE5vcyBwcm9tb3Rpb25zCiAgICAgICAgICAgIDwvaDI+CiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT0ibXQtMyB0ZXh0LXByZXR0
eSBsZWFkaW5nLXJlbGF4ZWQgdGV4dC1tdXRlZC1mb3JlZ3JvdW5kIj4KICAgICAgICAgICAgICBQcm9maXRleiBkZSBub3Mgb2ZmcmVzIGV4Y2x1c2l2ZXMg
cG91ciBwcmVuZHJlIHNvaW4gZGUgdm90cmUgcGVhdSDDoCBwZXRpdCBwcml4LgogICAgICAgICAgICA8L3A+CiAgICAgICAgICA8L2Rpdj4KCiAgICAgICAg
ICA8ZGl2IGNsYXNzTmFtZT0iZ3JpZCBmbGV4LTEgZ2FwLTUgc206Z3JpZC1jb2xzLTIgeGw6Z3JpZC1jb2xzLTMiPgogICAgICAgICAgICB7cHJvbW90aW9u
cy5tYXAoKHByb21vLCBpKSA9PiB7CiAgICAgICAgICAgICAgY29uc3QgSWNvbiA9IGljb25zW2kgJSBpY29ucy5sZW5ndGhdCiAgICAgICAgICAgICAgcmV0
dXJuICgKICAgICAgICAgICAgICAgIDxhcnRpY2xlCiAgICAgICAgICAgICAgICAgIGtleT17cHJvbW8uaWR9CiAgICAgICAgICAgICAgICAgIGNsYXNzTmFt
ZT0iZ3JvdXAgcmVsYXRpdmUgZmxleCBmbGV4LWNvbCBvdmVyZmxvdy1oaWRkZW4gcm91bmRlZC0zeGwgYm9yZGVyIGJvcmRlci1nb2xkLzMwIGJnLWNhcmQg
cC02IHNoYWRvdy1zbSB0cmFuc2l0aW9uLWFsbCBob3ZlcjotdHJhbnNsYXRlLXktMSBob3ZlcjpzaGFkb3cteGwiCiAgICAgICAgICAgICAgICA+CiAgICAg
ICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0iYWJzb2x1dGUgcmlnaHQtNSB0b3AtNSByb3VuZGVkLWZ1bGwgYmctcHJpbWFyeSBweC0zIHB5LTEgdGV4
dC1zbSBmb250LWV4dHJhYm9sZCB0ZXh0LXByaW1hcnktZm9yZWdyb3VuZCBzaGFkb3ciPgogICAgICAgICAgICAgICAgICAgIHtwcm9tby5iYWRnZX0KICAg
ICAgICAgICAgICAgICAgPC9zcGFuPgogICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9ImZsZXggaC0xMiB3LTEyIGl0ZW1zLWNlbnRlciBqdXN0
aWZ5LWNlbnRlciByb3VuZGVkLTJ4bCBiZy1zZWNvbmRhcnkgdGV4dC1wcmltYXJ5Ij4KICAgICAgICAgICAgICAgICAgICA8SWNvbiBjbGFzc05hbWU9Imgt
NiB3LTYiIC8+CiAgICAgICAgICAgICAgICAgIDwvc3Bhbj4KICAgICAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT0ibXQtNCBmb250LXNlcmlmIHRleHQt
eGwgZm9udC1ib2xkIHRleHQtZm9yZWdyb3VuZCI+e3Byb21vLnRpdGxlfTwvaDM+CiAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT0ibXQtMiBmbGV4
LTEgdGV4dC1wcmV0dHkgdGV4dC1zbSBsZWFkaW5nLXJlbGF4ZWQgdGV4dC1tdXRlZC1mb3JlZ3JvdW5kIj4KICAgICAgICAgICAgICAgICAgICB7cHJvbW8u
ZGVzY3JpcHRpb259CiAgICAgICAgICAgICAgICAgIDwvcD4KICAgICAgICAgICAgICAgICAge3Byb21vLmNvZGUgJiYgKAogICAgICAgICAgICAgICAgICAg
IDxwIGNsYXNzTmFtZT0ibXQtMyB0ZXh0LXNtIHRleHQtZm9yZWdyb3VuZCI+CiAgICAgICAgICAgICAgICAgICAgICBDb2RlJm5ic3A7OnsiICJ9CiAgICAg
ICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9InJvdW5kZWQtbWQgYm9yZGVyIGJvcmRlci1kYXNoZWQgYm9yZGVyLXByaW1hcnkvNTAgYmctc2Vj
b25kYXJ5IHB4LTIgcHktMC41IGZvbnQtbW9ubyBmb250LWJvbGQgdHJhY2tpbmctd2lkZXN0IHRleHQtcHJpbWFyeSI+CiAgICAgICAgICAgICAgICAgICAg
ICAgIHtwcm9tby5jb2RlfQogICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPgogICAgICAgICAgICAgICAgICAgIDwvcD4KICAgICAgICAgICAgICAgICAg
KX0KICAgICAgICAgICAgICAgICAgPGEKICAgICAgICAgICAgICAgICAgICBocmVmPXt3aGF0c2FwcExpbmsod2hhdHNhcHBOdW1iZXIsIHByb21vLnRpdGxl
LCBwcm9tby5jb2RlKX0KICAgICAgICAgICAgICAgICAgICB0YXJnZXQ9Il9ibGFuayIKICAgICAgICAgICAgICAgICAgICByZWw9Im5vb3BlbmVyIG5vcmVm
ZXJyZXIiCiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPSJtdC01IGlubGluZS1mbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBnYXAtMiBy
b3VuZGVkLWZ1bGwgYmctcHJpbWFyeSBweC01IHB5LTIuNSB0ZXh0LXNtIGZvbnQtc2VtaWJvbGQgdGV4dC1wcmltYXJ5LWZvcmVncm91bmQgdHJhbnNpdGlv
bi10cmFuc2Zvcm0gaG92ZXI6c2NhbGUtWzEuMDNdIgogICAgICAgICAgICAgICAgICA+CiAgICAgICAgICAgICAgICAgICAgPFdoYXRzQXBwSWNvbiBjbGFz
c05hbWU9ImgtNCB3LTQiIC8+CiAgICAgICAgICAgICAgICAgICAgSiZhcG9zO2VuIHByb2ZpdGUKICAgICAgICAgICAgICAgICAgPC9hPgogICAgICAgICAg
ICAgICAgPC9hcnRpY2xlPgogICAgICAgICAgICAgICkKICAgICAgICAgICAgfSl9CiAgICAgICAgICA8L2Rpdj4KICAgICAgICA8L2Rpdj4KICAgICAgPC9k
aXY+CiAgICA8L3NlY3Rpb24+CiAgKQp9Cg==
"@
Write-FileFromBase64 -relativePath "components\promotions.tsx" -base64Content $b64_0

Write-Host ""
Write-Host "Tous les fichiers ont ete ecrits avec succes." -ForegroundColor Green
Write-Host ""

$reponse = Read-Host "Voulez-vous committer et pousser ces changements sur git maintenant ? (o/n)"
if ($reponse -eq "o" -or $reponse -eq "O") {
    Write-Host ""
    Write-Host "Ajout des fichiers a git..." -ForegroundColor Cyan
    git add components/promotions.tsx

    Write-Host "Creation du commit..." -ForegroundColor Cyan
    git commit -m "Titre de la section Promotions deplace sur le cote pour laisser plus de place aux cartes"

    Write-Host "Envoi vers le depot distant..." -ForegroundColor Cyan
    git push

    Write-Host ""
    Write-Host "Termine ! Vercel va deployer automatiquement les changements." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Les fichiers ont ete ecrits mais AUCUN commit n'a ete fait." -ForegroundColor Yellow
    Write-Host "Pour committer plus tard, executez :" -ForegroundColor Yellow
    Write-Host "  git add ."
    Write-Host "  git commit -m ""Promotions layout"""
    Write-Host "  git push"
}
