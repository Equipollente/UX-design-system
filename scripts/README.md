# Scripts

Lignes a copier-coller dans un terminal PowerShell.

## Ouvrir une PR avec un message choisi

```powershell
cd "C:\Users\judit\Documents\Claude\Projects\UX-design-system"
./scripts/nouvelle-pr.ps1 -Branche "nom-de-branche" -Message "message du commit"
```

## Ouvrir une PR automatiquement (branche et message deduits des fichiers modifies)

```powershell
cd "C:\Users\judit\Documents\Claude\Projects\UX-design-system"
./scripts/auto-pr.ps1
```

## Recuperer main apres un merge et nettoyer la branche

```powershell
cd "C:\Users\judit\Documents\Claude\Projects\UX-design-system"
./scripts/sync-apres-merge.ps1
```
