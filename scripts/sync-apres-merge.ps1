<#
.SYNOPSIS
    Recupere le main a jour apres un merge sur GitHub et nettoie la branche mergee.

.PARAMETER Branche
    Nom de la branche a supprimer. Par defaut, la branche courante (si different de main).

.EXAMPLE
    ./scripts/sync-apres-merge.ps1
    ./scripts/sync-apres-merge.ps1 -Branche "fix/card-layout"
#>
param(
    [string]$Branche
)

$ErrorActionPreference = "Stop"

if (-not $Branche) {
    $Branche = git rev-parse --abbrev-ref HEAD
}

git checkout main
if ($LASTEXITCODE -ne 0) { throw "Echec du checkout main" }

git pull origin main
if ($LASTEXITCODE -ne 0) { throw "Echec du pull" }

if ($Branche -and $Branche -ne "main") {
    git branch -d $Branche
    if ($LASTEXITCODE -ne 0) { Write-Warning "Branche '$Branche' non supprimee (pas mergee localement ?)" }
}

git fetch origin --prune
if ($LASTEXITCODE -ne 0) { throw "Echec du fetch --prune" }
