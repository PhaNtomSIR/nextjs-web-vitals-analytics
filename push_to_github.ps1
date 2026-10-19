# push_to_github.ps1 - Push starter repo to https://github.com/PhaNtomSIR/nextjs-web-vitals-analytics

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Pushing Next.js Web Vitals Starter to GitHub" -ForegroundColor Cyan
Write-Host "  Account: PhaNtomSIR" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$ghPath = "C:\Users\PHANTOM\.local\bin\gh.exe"

# Check if repo already exists on GitHub
Write-Host "`n[1/3] Checking GitHub CLI status..." -ForegroundColor Yellow
$authCheck = & $ghPath auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "`nYou are not yet authenticated with GitHub CLI." -ForegroundColor Yellow
    Write-Host "Please authenticate in your browser by running:" -ForegroundColor White
    Write-Host "  gh auth login -w -p https" -ForegroundColor Green
    Write-Host "`nOr, if you already created the repo on https://github.com/new, press Enter to try pushing directly..." -ForegroundColor Gray
    Read-Host
} else {
    Write-Host "GitHub CLI is authenticated!" -ForegroundColor Green
    Write-Host "`n[2/3] Ensuring remote repository exists on PhaNtomSIR..." -ForegroundColor Yellow
    & $ghPath repo create PhaNtomSIR/nextjs-web-vitals-analytics --public --source=. --remote=origin --push 2>&1
}

Write-Host "`n[3/3] Pushing main branch..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nSUCCESS! Repository is live at:" -ForegroundColor Green
    Write-Host "https://github.com/PhaNtomSIR/nextjs-web-vitals-analytics" -ForegroundColor Cyan
} else {
    Write-Host "`nPush pending authorization. If you haven't created the empty repo yet, go to:" -ForegroundColor Yellow
    Write-Host "  https://github.com/new" -ForegroundColor White
    Write-Host "Create 'nextjs-web-vitals-analytics', then run:" -ForegroundColor White
    Write-Host "  git push -u origin main" -ForegroundColor Green
}
