@echo off
echo ========================================
echo   CashFlow OS - Hard Reset ^& Push
echo ========================================

:: Step 1: Remove .git folder to reset everything
echo [1/4] Resetting Git history...
rd /s /q .git

:: Step 2: Re-initialize Git
echo [2/4] Initializing fresh repository...
git init
git add .
git commit -m "Initial commit: CashFlow OS Financial System (Clean)"

:: Step 3: Add remote and rename branch
echo [3/4] Configuring branch and remote...
git branch -M main
git remote add origin https://github.com/ahmeddarkxx1-commits/Aibudget.git

:: Step 4: Force push to GitHub
echo [4/4] Pushing to GitHub (Force)...
git push -u origin main --force

echo ========================================
echo   Done! Your code is now clean on GitHub.
echo ========================================
pause
