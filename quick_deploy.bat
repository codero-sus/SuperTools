@echo off
setlocal
cd /d "%~dp0"
title SuperTools Simple Deployer

echo ========================================================
echo   SuperTools 1-Click Builder & Firebase Deployer
echo ========================================================
echo.

:: 1. Check Node
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed! Download from https://nodejs.org/
    pause
    exit /b 1
)

:: 2. Install dependencies
echo [1/4] Installing dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo [ERROR] npm install failed.
    pause
    exit /b 1
)

:: 3. Build the app into /dist
echo [2/4] Building production app into dist folder...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Build failed.
    pause
    exit /b 1
)

:: 4. Log in to Firebase
echo [3/4] Checking Firebase login...
call npx --yes firebase-tools login

:: 5. Select Project & Deploy
echo [4/4] Deploying to Firebase Hosting...
echo.
echo Your available Firebase projects:
call npx --yes firebase-tools projects:list
echo.
set /p PROJ_ID="Type your Firebase Project ID from the list above: "

if "%PROJ_ID%"=="" (
    echo [!] No project ID entered. Attempting deploy using default in .firebaserc...
    call npx --yes firebase-tools deploy --only hosting
) else (
    echo [*] Setting active project to %PROJ_ID%...
    call npx --yes firebase-tools use %PROJ_ID%
    call npx --yes firebase-tools deploy --only hosting --project %PROJ_ID%
)

if %ERRORLEVEL% equ 0 (
    echo.
    echo ========================================================
    echo   [SUCCESS] Deployment complete! Your app is live!
    echo ========================================================
) else (
    echo.
    echo [ERROR] Deploy failed. Make sure your Project ID is correct and you have Hosting enabled in Firebase Console.
)

echo.
pause
