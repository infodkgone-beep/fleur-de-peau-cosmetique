# ============================================================================
#  Fleur de peau Cosmetique - Icones pour les nouvelles categories
#
#  Ajoute les icones pour les nouvelles categories (Gel douche, Parfums,
#  Soins dentaires, Maquillage, Cheveux) qui seront visibles sur la page
#  d'accueil, section "Explorez nos categories".
#
#  IMPORTANT : ce script ne fait qu'ecrire le CODE. Les categories elles-memes
#  (les donnees) doivent etre ajoutees separement via une requete SQL a coller
#  dans Supabase -> SQL Editor. Voir le message de Claude pour cette requete.
#
#  Utilisation :
#    1) Clic droit sur ce fichier > "Executer avec PowerShell"
#       (ou dans un terminal PowerShell ouvert a la racine du projet :
#        .\icones-categories.ps1)
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
aW1wb3J0IHsKICBTcGFya2xlcywKICBGbG93ZXIyLAogIFN1biwKICBEcm9wbGV0cywKICBTaGllbGRDaGVjaywKICBMZWFmLAogIFNob3dlckhlYWQsCiAg
U3ByYXlDYW4sCiAgU21pbGUsCiAgUGFsZXR0ZSwKICBTY2lzc29ycywKICB0eXBlIEx1Y2lkZUljb24sCn0gZnJvbSAibHVjaWRlLXJlYWN0IgoKY29uc3Qg
aWNvbk1hcDogUmVjb3JkPHN0cmluZywgTHVjaWRlSWNvbj4gPSB7CiAgU3BhcmtsZXMsCiAgRmxvd2VyMiwKICBTdW4sCiAgRHJvcGxldHMsCiAgU2hpZWxk
Q2hlY2ssCiAgTGVhZiwKICBTaG93ZXJIZWFkLAogIFNwcmF5Q2FuLAogIFNtaWxlLAogIFBhbGV0dGUsCiAgU2Npc3NvcnMsCn0KCnR5cGUgQ2F0ZWdvcnkg
PSB7IG5hbWU6IHN0cmluZzsgZGVzY3JpcHRpb246IHN0cmluZyB8IG51bGw7IGljb246IHN0cmluZyB8IG51bGwgfQoKZXhwb3J0IGZ1bmN0aW9uIENhdGVn
b3JpZXMoeyBjYXRlZ29yaWVzIH06IHsgY2F0ZWdvcmllczogQ2F0ZWdvcnlbXSB9KSB7CiAgaWYgKGNhdGVnb3JpZXMubGVuZ3RoID09PSAwKSByZXR1cm4g
bnVsbAoKICByZXR1cm4gKAogICAgPHNlY3Rpb24gaWQ9ImNhdGVnb3JpZXMiIGNsYXNzTmFtZT0ibXgtYXV0byBtYXgtdy03eGwgcHgtNCBweS0xNCBzbTpw
eC02IG1kOnB5LTIwIj4KICAgICAgPGRpdiBjbGFzc05hbWU9Im14LWF1dG8gbWF4LXctMnhsIHRleHQtY2VudGVyIj4KICAgICAgICA8cCBjbGFzc05hbWU9
InRleHQtc20gZm9udC1zZW1pYm9sZCB1cHBlcmNhc2UgdHJhY2tpbmctWzAuM2VtXSB0ZXh0LWdvbGQtZm9yZWdyb3VuZCI+Tm9zIHVuaXZlcnM8L3A+CiAg
ICAgICAgPGgyIGNsYXNzTmFtZT0ibXQtMyB0ZXh0LWJhbGFuY2UgZm9udC1zZXJpZiB0ZXh0LTN4bCBmb250LWJvbGQgdGV4dC1mb3JlZ3JvdW5kIHNtOnRl
eHQtNHhsIj4KICAgICAgICAgIEV4cGxvcmV6IG5vcyBjYXTDqWdvcmllcwogICAgICAgIDwvaDI+CiAgICAgIDwvZGl2PgoKICAgICAgPGRpdiBjbGFzc05h
bWU9Im10LTEwIGdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTQgc206Z2FwLTUgbWQ6Z3JpZC1jb2xzLTMiPgogICAgICAgIHtjYXRlZ29yaWVzLm1hcCgoY2F0KSA9
PiB7CiAgICAgICAgICBjb25zdCBJY29uID0gaWNvbk1hcFtjYXQuaWNvbiA/PyAiIl0gPz8gU3BhcmtsZXMKICAgICAgICAgIHJldHVybiAoCiAgICAgICAg
ICAgIDxhCiAgICAgICAgICAgICAga2V5PXtjYXQubmFtZX0KICAgICAgICAgICAgICBocmVmPSIjYm91dGlxdWUiCiAgICAgICAgICAgICAgY2xhc3NOYW1l
PSJncm91cCBmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlciByb3VuZGVkLTJ4bCBib3JkZXIgYm9yZGVyLWJvcmRlciBiZy1jYXJkIHAtNSB0ZXh0LWNlbnRl
ciBzaGFkb3ctc20gdHJhbnNpdGlvbi1hbGwgaG92ZXI6LXRyYW5zbGF0ZS15LTEgaG92ZXI6Ym9yZGVyLWdvbGQvNjAgaG92ZXI6c2hhZG93LWxnIHNtOnAt
NiIKICAgICAgICAgICAgPgogICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0iZmxleCBoLTE0IHctMTQgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVy
IHJvdW5kZWQtZnVsbCBiZy1zZWNvbmRhcnkgdGV4dC1wcmltYXJ5IHRyYW5zaXRpb24tY29sb3JzIGdyb3VwLWhvdmVyOmJnLXByaW1hcnkgZ3JvdXAtaG92
ZXI6dGV4dC1wcmltYXJ5LWZvcmVncm91bmQiPgogICAgICAgICAgICAgICAgPEljb24gY2xhc3NOYW1lPSJoLTYgdy02IiAvPgogICAgICAgICAgICAgIDwv
c3Bhbj4KICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPSJtdC00IGZvbnQtc2VyaWYgdGV4dC1iYXNlIGZvbnQtc2VtaWJvbGQgdGV4dC1mb3JlZ3JvdW5k
IHNtOnRleHQtbGciPntjYXQubmFtZX08L2gzPgogICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT0ibXQtMSB0ZXh0LXhzIHRleHQtbXV0ZWQtZm9yZWdyb3Vu
ZCBzbTp0ZXh0LXNtIj57Y2F0LmRlc2NyaXB0aW9ufTwvcD4KICAgICAgICAgICAgPC9hPgogICAgICAgICAgKQogICAgICAgIH0pfQogICAgICA8L2Rpdj4K
ICAgIDwvc2VjdGlvbj4KICApCn0K
"@
Write-FileFromBase64 -relativePath "components\categories.tsx" -base64Content $b64_0

Write-Host ""
Write-Host "Tous les fichiers ont ete ecrits avec succes." -ForegroundColor Green
Write-Host ""
Write-Host "N'oublie pas d'executer aussi la requete SQL dans Supabase pour creer" -ForegroundColor Yellow
Write-Host "les categories elles-memes (voir le message de Claude)." -ForegroundColor Yellow
Write-Host ""

$reponse = Read-Host "Voulez-vous committer et pousser ces changements sur git maintenant ? (o/n)"
if ($reponse -eq "o" -or $reponse -eq "O") {
    Write-Host ""
    Write-Host "Ajout des fichiers a git..." -ForegroundColor Cyan
    git add components/categories.tsx

    Write-Host "Creation du commit..." -ForegroundColor Cyan
    git commit -m "Ajout des icones pour les nouvelles categories (gel douche, parfum, dents, maquillage, cheveux)"

    Write-Host "Envoi vers le depot distant..." -ForegroundColor Cyan
    git push

    Write-Host ""
    Write-Host "Termine ! Vercel va deployer automatiquement les changements." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Les fichiers ont ete ecrits mais AUCUN commit n'a ete fait." -ForegroundColor Yellow
    Write-Host "Pour committer plus tard, executez :" -ForegroundColor Yellow
    Write-Host "  git add ."
    Write-Host "  git commit -m ""Icones nouvelles categories"""
    Write-Host "  git push"
}
