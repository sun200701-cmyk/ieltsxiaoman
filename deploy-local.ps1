param(
  [string]$Message = "deploy update"
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$server = "ubuntu@43.128.21.242"
$remotePath = "/home/ubuntu/ieltsxiaoman"

Write-Host "[1/5] Entering project directory..."
Set-Location $projectRoot

Write-Host "[2/5] Checking local changes..."
$hasChanges = git status --porcelain
if (-not $hasChanges) {
  Write-Host "No local changes detected. Skipping commit."
} else {
  Write-Host "[3/5] Committing local changes..."
  git add .
  git commit -m $Message
}

Write-Host "[4/5] Pushing to GitHub..."
git push

Write-Host "[5/5] Deploying on server..."
ssh $server "cd $remotePath && ./deploy.sh"

Write-Host "Local to server deployment completed."
