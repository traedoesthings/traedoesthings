# Traedoesthings publish script
# Syncs vault into Quartz content folder, commits, pushes.

$ErrorActionPreference = "Stop"
$vault = "C:\Users\Trae\CoWork\Traedoesthings"
$content = "C:\Users\Trae\Quartz\content"

Write-Host "Syncing vault -> content..." -ForegroundColor Cyan

robocopy $vault $content /MIR `
    /XD "drafts" "private" "templates" ".obsidian" ".trash" `
    /XF ".DS_Store" `
    /NFL /NDL /NJH /NJS /NP | Out-Null

if ($LASTEXITCODE -ge 8) {
    Write-Host "robocopy failed with exit code $LASTEXITCODE" -ForegroundColor Red
    exit 1
}

Set-Location "C:\Users\Trae\Quartz"

$changes = git status --porcelain
if (-not $changes) {
    Write-Host "No changes to publish." -ForegroundColor Yellow
    exit 0
}

Write-Host "Committing and pushing..." -ForegroundColor Cyan
git add content
$stamp = Get-Date -Format "yyyy-MM-dd HH:mm"
git commit -m "Publish: $stamp"
git push

Write-Host "Done. Cloudflare will rebuild in ~90 seconds." -ForegroundColor Green
