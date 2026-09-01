<#
.SYNOPSIS
    Cree une branche, commit et pousse les fichiers modifies, puis ouvre une PR - sans rien
    demander : le nom de branche et le message de commit sont deduits des fichiers changes.

.DESCRIPTION
    A lancer depuis une branche a jour (main). S'arrete sans rien faire s'il n'y a aucun
    changement dans l'arbre de travail.

.EXAMPLE
    ./scripts/auto-pr.ps1
#>
$ErrorActionPreference = "Stop"

function ConvertTo-Slug([string]$Texte) {
    $slug = $Texte.ToLowerInvariant() -replace '[^a-z0-9]+', '-'
    $slug = $slug.Trim('-')
    if ($slug.Length -gt 30) { $slug = $slug.Substring(0, 30).Trim('-') }
    return $slug
}

$statut = git status --porcelain
if (-not $statut) {
    Write-Host "Rien a committer."
    exit 0
}

$modifies = @()
$ajoutes  = @()
$supprimes = @()

foreach ($ligne in $statut) {
    $code = $ligne.Substring(0, 2)
    $chemin = $ligne.Substring(3).Trim()
    $nomFichier = Split-Path $chemin -Leaf
    switch -Regex ($code) {
        '\?\?' { $ajoutes += $nomFichier }
        'A.'   { $ajoutes += $nomFichier }
        'D.'   { $supprimes += $nomFichier }
        default { $modifies += $nomFichier }
    }
}

# Nom de branche : derive du premier fichier touche + horodatage pour garantir l'unicite
$premierFichier = ($statut[0].Substring(3).Trim())
$nomBase = [System.IO.Path]::GetFileNameWithoutExtension((Split-Path $premierFichier -Leaf))
$slug = ConvertTo-Slug $nomBase
$horodatage = Get-Date -Format "yyyyMMdd-HHmmss"
$Branche = "auto/$slug-$horodatage"

# Message de commit : resume les fichiers touches par categorie
$parties = @()
if ($modifies.Count -gt 0)   { $parties += "Modifie: $($modifies -join ', ')" }
if ($ajoutes.Count -gt 0)    { $parties += "Ajoute: $($ajoutes -join ', ')" }
if ($supprimes.Count -gt 0)  { $parties += "Supprime: $($supprimes -join ', ')" }
$Message = $parties -join " - "
if ($Message.Length -gt 200) { $Message = $Message.Substring(0, 197) + "..." }

$Titre = $Message

Write-Host "Branche : $Branche"
Write-Host "Message : $Message"

git fetch origin main
if ($LASTEXITCODE -ne 0) { throw "Echec du fetch" }

git checkout -b $Branche origin/main
if ($LASTEXITCODE -ne 0) { throw "Echec de la creation de la branche" }

git add -A
if ($LASTEXITCODE -ne 0) { throw "Echec du git add" }

git commit -m $Message
if ($LASTEXITCODE -ne 0) { throw "Echec du commit" }

git push origin $Branche
if ($LASTEXITCODE -ne 0) { throw "Echec du push" }

gh pr create --repo Equipollente/UX-design-system --base main --head $Branche --title $Titre --body "Cree automatiquement par auto-pr.ps1."
if ($LASTEXITCODE -ne 0) { throw "Echec de la creation de la PR" }
