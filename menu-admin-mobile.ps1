# ============================================================================
#  Fleur de peau Cosmetique - Menu admin sur mobile
#
#  Corrige le bug : sur telephone, seul le tableau de bord etait visible dans
#  l'admin car le menu lateral (Produits, Commandes, Stock...) etait entierement
#  cache en dessous d'une certaine largeur d'ecran, sans aucune alternative.
#  Ajoute un bouton menu (hamburger) en haut de l'ecran sur mobile/tablette qui
#  ouvre la meme liste de liens que sur PC.
#
#  Utilisation :
#    1) Clic droit sur ce fichier > "Executer avec PowerShell"
#       (ou dans un terminal PowerShell ouvert a la racine du projet :
#        .\menu-admin-mobile.ps1)
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
InVzZSBjbGllbnQiCgppbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlLCB0eXBlIFJlYWN0Tm9kZSB9IGZyb20gInJlYWN0IgppbXBvcnQgeyB1c2VQYXRo
bmFtZSB9IGZyb20gIm5leHQvbmF2aWdhdGlvbiIKaW1wb3J0IHsgTWVudSwgWCB9IGZyb20gImx1Y2lkZS1yZWFjdCIKCi8qKgogKiBCYXJyZSArIG1lbnUg
ZGUgbmF2aWdhdGlvbiBhZG1pbiBwb3VyIG1vYmlsZS90YWJsZXR0ZSAoZW4gZGVzc291cyBkdSBicmVha3BvaW50IG1kKS4KICogYGNoaWxkcmVuYCByZcOn
b2l0IGxlcyBsaWVucyBkZSBuYXZpZ2F0aW9uIGTDqWrDoCByZW5kdXMgY8O0dMOpIHNlcnZldXIgKHZvaXIgYXBwL2FkbWluL2xheW91dC50c3gpIDoKICog
b24gbmUgZmFpdCBpY2kgcXVlIGfDqXJlciBsJ291dmVydHVyZS9mZXJtZXR1cmUsIHBhcyBsZSBjb250ZW51IGR1IG1lbnUgbHVpLW3Dqm1lLgogKi8KZXhw
b3J0IGZ1bmN0aW9uIE1vYmlsZU5hdih7IGNoaWxkcmVuIH06IHsgY2hpbGRyZW46IFJlYWN0Tm9kZSB9KSB7CiAgY29uc3QgW29wZW4sIHNldE9wZW5dID0g
dXNlU3RhdGUoZmFsc2UpCiAgY29uc3QgcGF0aG5hbWUgPSB1c2VQYXRobmFtZSgpCgogIHVzZUVmZmVjdCgoKSA9PiB7CiAgICBzZXRPcGVuKGZhbHNlKQog
IH0sIFtwYXRobmFtZV0pCgogIHJldHVybiAoCiAgICA8ZGl2IGNsYXNzTmFtZT0iYm9yZGVyLWIgYm9yZGVyLWJvcmRlciBiZy1jYXJkIG1kOmhpZGRlbiI+
CiAgICAgIDxkaXYgY2xhc3NOYW1lPSJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gcHgtNCBweS0zIj4KICAgICAgICA8ZGl2PgogICAgICAg
ICAgPHAgY2xhc3NOYW1lPSJmb250LXNlcmlmIHRleHQtYmFzZSBmb250LWJvbGQgdGV4dC1wcmltYXJ5Ij5GbGV1ciBkZSBwZWF1PC9wPgogICAgICAgICAg
PHAgY2xhc3NOYW1lPSJ0ZXh0LVswLjY1cmVtXSB0ZXh0LW11dGVkLWZvcmVncm91bmQiPkFkbWluaXN0cmF0aW9uPC9wPgogICAgICAgIDwvZGl2PgogICAg
ICAgIDxidXR0b24KICAgICAgICAgIHR5cGU9ImJ1dHRvbiIKICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldE9wZW4oKHYpID0+ICF2KX0KICAgICAgICAg
IGFyaWEtbGFiZWw9e29wZW4gPyAiRmVybWVyIGxlIG1lbnUiIDogIk91dnJpciBsZSBtZW51In0KICAgICAgICAgIGFyaWEtZXhwYW5kZWQ9e29wZW59CiAg
ICAgICAgICBjbGFzc05hbWU9ImZsZXggaC0xMCB3LTEwIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciByb3VuZGVkLWZ1bGwgdGV4dC1mb3JlZ3JvdW5k
LzgwIHRyYW5zaXRpb24tY29sb3JzIGhvdmVyOmJnLXNlY29uZGFyeSIKICAgICAgICA+CiAgICAgICAgICB7b3BlbiA/IDxYIGNsYXNzTmFtZT0iaC01IHct
NSIgLz4gOiA8TWVudSBjbGFzc05hbWU9ImgtNSB3LTUiIC8+fQogICAgICAgIDwvYnV0dG9uPgogICAgICA8L2Rpdj4KICAgICAge29wZW4gJiYgPGRpdiBj
bGFzc05hbWU9ImJvcmRlci10IGJvcmRlci1ib3JkZXIiPntjaGlsZHJlbn08L2Rpdj59CiAgICA8L2Rpdj4KICApCn0K
"@
Write-FileFromBase64 -relativePath "components\admin\mobile-nav.tsx" -base64Content $b64_0

$b64_1 = @"
aW1wb3J0IHR5cGUgeyBSZWFjdE5vZGUgfSBmcm9tICJyZWFjdCIKaW1wb3J0IExpbmsgZnJvbSAibmV4dC9saW5rIgppbXBvcnQgeyByZXF1aXJlUm9sZSwg
Uk9MRV9MQUJFTFMgfSBmcm9tICJAL2xpYi9hdXRoIgppbXBvcnQgeyBBZG1pblNpZ25PdXRCdXR0b24gfSBmcm9tICJAL2NvbXBvbmVudHMvYWRtaW4vc2ln
bi1vdXQtYnV0dG9uIgppbXBvcnQgeyBNb2JpbGVOYXYgfSBmcm9tICJAL2NvbXBvbmVudHMvYWRtaW4vbW9iaWxlLW5hdiIKaW1wb3J0IHsKICBMYXlvdXRE
YXNoYm9hcmQsCiAgUGFja2FnZSwKICBTaG9wcGluZ0NhcnQsCiAgQm94ZXMsCiAgV2FsbGV0LAogIE1lZ2FwaG9uZSwKICBJbWFnZSBhcyBJbWFnZUljb24s
CiAgVXNlcnMsCiAgVGFnLAp9IGZyb20gImx1Y2lkZS1yZWFjdCIKCmNvbnN0IE5BViA9IFsKICB7IGhyZWY6ICIvYWRtaW4iLCBsYWJlbDogIlRhYmxlYXUg
ZGUgYm9yZCIsIGljb246IExheW91dERhc2hib2FyZCwgcm9sZXM6IFsic3VwZXJfYWRtaW4iLCAiYWRtaW5fY29tbWVyY2lhbCIsICJjb250ZW50X21hbmFn
ZXIiXSB9LAogIHsgaHJlZjogIi9hZG1pbi9wcm9kdWl0cyIsIGxhYmVsOiAiUHJvZHVpdHMiLCBpY29uOiBQYWNrYWdlLCByb2xlczogWyJzdXBlcl9hZG1p
biIsICJhZG1pbl9jb21tZXJjaWFsIiwgImNvbnRlbnRfbWFuYWdlciJdIH0sCiAgeyBocmVmOiAiL2FkbWluL2NvbW1hbmRlcyIsIGxhYmVsOiAiQ29tbWFu
ZGVzIC8gVmVudGVzIiwgaWNvbjogU2hvcHBpbmdDYXJ0LCByb2xlczogWyJzdXBlcl9hZG1pbiIsICJhZG1pbl9jb21tZXJjaWFsIl0gfSwKICB7IGhyZWY6
ICIvYWRtaW4vc3RvY2siLCBsYWJlbDogIlN0b2NrICYgQWNoYXRzIiwgaWNvbjogQm94ZXMsIHJvbGVzOiBbInN1cGVyX2FkbWluIiwgImFkbWluX2NvbW1l
cmNpYWwiXSB9LAogIHsgaHJlZjogIi9hZG1pbi9jb21wdGFiaWxpdGUiLCBsYWJlbDogIkNvbXB0YWJpbGl0w6kiLCBpY29uOiBXYWxsZXQsIHJvbGVzOiBb
InN1cGVyX2FkbWluIl0gfSwKICB7IGhyZWY6ICIvYWRtaW4vcHJvbW90aW9ucyIsIGxhYmVsOiAiQ29kZXMgcHJvbW8iLCBpY29uOiBUYWcsIHJvbGVzOiBb
InN1cGVyX2FkbWluIiwgImFkbWluX2NvbW1lcmNpYWwiXSB9LAogIHsgaHJlZjogIi9hZG1pbi9jb250ZW51IiwgbGFiZWw6ICJDb250ZW51IGR1IHNpdGUi
LCBpY29uOiBJbWFnZUljb24sIHJvbGVzOiBbInN1cGVyX2FkbWluIiwgImNvbnRlbnRfbWFuYWdlciJdIH0sCiAgeyBocmVmOiAiL2FkbWluL21hcmtldGlu
ZyIsIGxhYmVsOiAiUGl4ZWxzIG1hcmtldGluZyIsIGljb246IE1lZ2FwaG9uZSwgcm9sZXM6IFsic3VwZXJfYWRtaW4iXSB9LAogIHsgaHJlZjogIi9hZG1p
bi91dGlsaXNhdGV1cnMiLCBsYWJlbDogIlV0aWxpc2F0ZXVycyIsIGljb246IFVzZXJzLCByb2xlczogWyJzdXBlcl9hZG1pbiJdIH0sCl0gYXMgY29uc3QK
CnR5cGUgTmF2SXRlbSA9ICh0eXBlb2YgTkFWKVtudW1iZXJdCgpmdW5jdGlvbiBOYXZMaW5rcyh7IGl0ZW1zIH06IHsgaXRlbXM6IE5hdkl0ZW1bXSB9KSB7
CiAgcmV0dXJuICgKICAgIDxuYXYgY2xhc3NOYW1lPSJmbGV4LTEgc3BhY2UteS0xIHAtMyI+CiAgICAgIHtpdGVtcy5tYXAoKGl0ZW0pID0+ICgKICAgICAg
ICA8TGluawogICAgICAgICAga2V5PXtpdGVtLmhyZWZ9CiAgICAgICAgICBocmVmPXtpdGVtLmhyZWZ9CiAgICAgICAgICBjbGFzc05hbWU9ImZsZXggaXRl
bXMtY2VudGVyIGdhcC0zIHJvdW5kZWQteGwgcHgtMyBweS0yLjUgdGV4dC1zbSBmb250LW1lZGl1bSB0ZXh0LWZvcmVncm91bmQvODAgdHJhbnNpdGlvbi1j
b2xvcnMgaG92ZXI6Ymctc2Vjb25kYXJ5IGhvdmVyOnRleHQtcHJpbWFyeSIKICAgICAgICA+CiAgICAgICAgICA8aXRlbS5pY29uIGNsYXNzTmFtZT0iaC00
IHctNCIgLz4KICAgICAgICAgIHtpdGVtLmxhYmVsfQogICAgICAgIDwvTGluaz4KICAgICAgKSl9CiAgICA8L25hdj4KICApCn0KCmZ1bmN0aW9uIEFjY291
bnRCbG9jayh7IGZ1bGxOYW1lLCByb2xlTGFiZWwgfTogeyBmdWxsTmFtZTogc3RyaW5nOyByb2xlTGFiZWw6IHN0cmluZyB9KSB7CiAgcmV0dXJuICgKICAg
IDxkaXYgY2xhc3NOYW1lPSJib3JkZXItdCBib3JkZXItYm9yZGVyIHAtNCI+CiAgICAgIDxwIGNsYXNzTmFtZT0idHJ1bmNhdGUgdGV4dC1zbSBmb250LW1l
ZGl1bSB0ZXh0LWZvcmVncm91bmQiPntmdWxsTmFtZX08L3A+CiAgICAgIDxwIGNsYXNzTmFtZT0idGV4dC14cyB0ZXh0LW11dGVkLWZvcmVncm91bmQiPnty
b2xlTGFiZWx9PC9wPgogICAgICA8QWRtaW5TaWduT3V0QnV0dG9uIC8+CiAgICA8L2Rpdj4KICApCn0KCmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9u
IEFkbWluTGF5b3V0KHsgY2hpbGRyZW4gfTogeyBjaGlsZHJlbjogUmVhY3ROb2RlIH0pIHsKICBjb25zdCBwcm9maWxlID0gYXdhaXQgcmVxdWlyZVJvbGUo
KQogIGNvbnN0IHZpc2libGVOYXYgPSBOQVYuZmlsdGVyKChpdGVtKSA9PiAoaXRlbS5yb2xlcyBhcyByZWFkb25seSBzdHJpbmdbXSkuaW5jbHVkZXMocHJv
ZmlsZS5yb2xlISkpCgogIHJldHVybiAoCiAgICA8ZGl2IGNsYXNzTmFtZT0iZmxleCBtaW4taC1zY3JlZW4gZmxleC1jb2wgYmctc2Vjb25kYXJ5LzMwIG1k
OmZsZXgtcm93Ij4KICAgICAgPE1vYmlsZU5hdj4KICAgICAgICA8TmF2TGlua3MgaXRlbXM9e3Zpc2libGVOYXZ9IC8+CiAgICAgICAgPEFjY291bnRCbG9j
ayBmdWxsTmFtZT17cHJvZmlsZS5mdWxsX25hbWV9IHJvbGVMYWJlbD17Uk9MRV9MQUJFTFNbcHJvZmlsZS5yb2xlIV19IC8+CiAgICAgIDwvTW9iaWxlTmF2
PgoKICAgICAgPGFzaWRlIGNsYXNzTmFtZT0iaGlkZGVuIHctNjQgZmxleC1zaHJpbmstMCBmbGV4LWNvbCBib3JkZXItciBib3JkZXItYm9yZGVyIGJnLWNh
cmQgbWQ6ZmxleCI+CiAgICAgICAgPGRpdiBjbGFzc05hbWU9ImJvcmRlci1iIGJvcmRlci1ib3JkZXIgcC01Ij4KICAgICAgICAgIDxwIGNsYXNzTmFtZT0i
Zm9udC1zZXJpZiB0ZXh0LWxnIGZvbnQtYm9sZCB0ZXh0LXByaW1hcnkiPkZsZXVyIGRlIHBlYXU8L3A+CiAgICAgICAgICA8cCBjbGFzc05hbWU9InRleHQt
eHMgdGV4dC1tdXRlZC1mb3JlZ3JvdW5kIj5BZG1pbmlzdHJhdGlvbjwvcD4KICAgICAgICA8L2Rpdj4KICAgICAgICA8TmF2TGlua3MgaXRlbXM9e3Zpc2li
bGVOYXZ9IC8+CiAgICAgICAgPEFjY291bnRCbG9jayBmdWxsTmFtZT17cHJvZmlsZS5mdWxsX25hbWV9IHJvbGVMYWJlbD17Uk9MRV9MQUJFTFNbcHJvZmls
ZS5yb2xlIV19IC8+CiAgICAgIDwvYXNpZGU+CgogICAgICA8bWFpbiBjbGFzc05hbWU9ImZsZXgtMSBvdmVyZmxvdy14LWhpZGRlbiBwLTQgbWQ6cC04Ij57
Y2hpbGRyZW59PC9tYWluPgogICAgPC9kaXY+CiAgKQp9Cg==
"@
Write-FileFromBase64 -relativePath "app\admin\layout.tsx" -base64Content $b64_1

Write-Host ""
Write-Host "Tous les fichiers ont ete ecrits avec succes." -ForegroundColor Green
Write-Host ""
Write-Host "Resume des changements :" -ForegroundColor Cyan
Write-Host "  - Nouveau : bouton menu (hamburger) dans l'admin sur mobile/tablette"
Write-Host "  - Corrige : Produits, Commandes, Stock... sont maintenant accessibles sur telephone"
Write-Host ""

$reponse = Read-Host "Voulez-vous committer et pousser ces changements sur git maintenant ? (o/n)"
if ($reponse -eq "o" -or $reponse -eq "O") {
    Write-Host ""
    Write-Host "Ajout des fichiers a git..." -ForegroundColor Cyan
    git add components/admin/mobile-nav.tsx app/admin/layout.tsx

    Write-Host "Creation du commit..." -ForegroundColor Cyan
    git commit -m "Ajout du menu admin sur mobile (les autres pages etaient inaccessibles sur telephone)"

    Write-Host "Envoi vers le depot distant..." -ForegroundColor Cyan
    git push

    Write-Host ""
    Write-Host "Termine ! Vercel va deployer automatiquement les changements." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Les fichiers ont ete ecrits mais AUCUN commit n'a ete fait." -ForegroundColor Yellow
    Write-Host "Pour committer plus tard, executez :" -ForegroundColor Yellow
    Write-Host "  git add ."
    Write-Host "  git commit -m ""Menu admin mobile"""
    Write-Host "  git push"
}
