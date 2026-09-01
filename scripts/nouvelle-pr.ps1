<#
.SYNOPSIS
    Crée une branche, commit les fichiers modifiés, la pousse et ouvre une PR sur GitHub.

.PARAMETER Branche
    Nom de la nouvelle branche (créée depuis origin/main).

.PARAMETER Message
    Message du commit.

.PARAMETER Titre
    Titre de la PR. Par défaut, reprend le message du commit.

.PARAMETER Corps
    Description de la PR. Par défaut, vide.

.PARAMETER Fichiers
    Fichiers à ajouter au commit. Par défaut, tous les fichiers modifiés/créés (git add -A).

.EXAMPLE
    ./scripts/nouvelle-pr.ps1 -Branche "fix/card-layout" -Message "Corrige l'alignement de Card"
#>
param(
    [Parameter(Mandatory = $true)]
    [string]$Branche,

    [Parameter(Mandatory = $true)]
    [string]$Message,

    [string]$Titre,

    [string]$Corps = "",

    [string[]]$Fichiers
)

$ErrorActionPreference = "Stop"

if (-not $Titre) {
    $Titre = $Message
}

git fetch origin main
if ($LASTEXITCODE -ne 0) { throw "Échec du fetch" }

git checkout -b $Branche origin/main
if ($LASTEXITCODE -ne 0) { throw "Échec de la création de la branche (existe-t-elle déjà ?)" }

if ($Fichiers) {
    git add $Fichiers
} else {
    git add -A
}
if ($LASTEXITCODE -ne 0) { throw "Échec du git add" }

git commit -m $Message
if ($LASTEXITCODE -ne 0) { throw "Échec du commit" }

git push origin $Branche
if ($LASTEXITCODE -ne 0) { throw "Échec du push" }

gh pr create --repo Equipollente/UX-design-system --base main --head $Branche --title $Titre --body $Corps
if ($LASTEXITCODE -ne 0) { throw "Échec de la création de la PR" }
