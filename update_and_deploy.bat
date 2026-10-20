@echo off
setlocal
title SuperTools 1-Click Updater & Deployer

:: Navigate automatically to the repository folder where this script lives
cd /d "%~dp0"

echo ========================================================
echo        SuperTools - Pull Latest Updates & Deploy
echo ========================================================
echo.

:: 1. Fetch latest updates from the active session branch
echo [1/4] Fetching latest updates from GitHub...
git fetch origin arena/0112e70e-supertools
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Git fetch failed! Check your internet connection.
    pause
    exit /b 1
)

:: 2. Fast-forward / cleanly sync local files to match remote
echo [2/4] Syncing local files to latest commit...
git reset --hard FETCH_HEAD
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Git sync failed!
    pause
    exit /b 1
)

:: 3. Install any updated dependencies
echo [3/5] Installing updated dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo [ERROR] npm install failed!
    pause
    exit /b 1
)

:: 4. Compile fresh production build into dist
echo [4/5] Compiling production build into dist...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Build failed! Check the console output above.
    pause
    exit /b 1
)

:: 5. Deploy latest build to Firebase Hosting
echo [5/5] Deploying to Firebase Hosting (the-supertools.web.app)...
call npx --yes firebase-tools deploy --only hosting
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Firebase deploy failed!
    pause
    exit /b 1
)

echo.
echo ========================================================
echo   [SUCCESS] Live app updated at https://the-supertools.web.app
echo ========================================================
echo.
pause
