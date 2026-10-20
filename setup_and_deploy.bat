@echo off
setlocal enabledelayedexpansion
title SuperTools - Setup, Build & Firebase Deploy
color 0B

echo ===============================================================================
echo                SuperTools - Automated Firebase Deployment Script
echo ===============================================================================
echo.

:: Step 1: Verify Git
echo [*] Checking Git installation...
where git >nul 2>&1
if %ERRORLEVEL% neq 0 (
    color 0C
    echo [ERROR] Git is not installed or not in PATH!
    echo Please install Git from https://git-scm.com/
    pause
    exit /b 1
)
echo [OK] Git detected:
git --version
echo.

:: Step 2: Verify Node.js and npm
echo [*] Checking Node.js and npm...
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    color 0C
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js (v18 or newer) from https://nodejs.org/
    pause
    exit /b 1
)
where npm >nul 2>&1
if %ERRORLEVEL% neq 0 (
    color 0C
    echo [ERROR] npm is not installed or not in PATH!
    pause
    exit /b 1
)
echo [OK] Node.js detected:
node --version
echo [OK] npm detected:
npm --version
echo.

:: Step 3: Verify Firebase CLI
echo [*] Checking Firebase CLI...
where firebase >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [!] Firebase CLI not found. Installing firebase-tools globally via npm...
    call npm install -g firebase-tools
    if %ERRORLEVEL% neq 0 (
        color 0C
        echo [ERROR] Failed to install firebase-tools.
        echo Try running Command Prompt as Administrator.
        pause
        exit /b 1
    )
)
echo [OK] Firebase CLI detected:
call firebase --version
echo.

:: Step 4: Clone Repository (if not already inside it)
if exist "package.json" (
    echo [*] Current directory already contains SuperTools package.json. Skipping clone.
) else (
    echo [*] Cloning repository from branch arena/0112e70e-supertools...
    if exist "SuperTools" (
        echo [*] Directory 'SuperTools' already exists. Navigating inside...
        cd SuperTools
    ) else (
        git clone -b arena/0112e70e-supertools https://github.com/codero-sus/SuperTools.git
        if %ERRORLEVEL% neq 0 (
            color 0C
            echo [ERROR] Git clone failed! Check your internet connection or git permissions.
            pause
            exit /b 1
        )
        cd SuperTools
    )
)
echo.

:: Step 5: Install Dependencies
echo [*] Installing dependencies with npm install...
call npm install
if %ERRORLEVEL% neq 0 (
    color 0C
    echo [ERROR] npm install encountered errors!
    pause
    exit /b 1
)
echo [OK] Dependencies installed successfully.
echo.

:: Step 6: Authenticate with Firebase
echo [*] Checking Firebase authentication status...
call firebase login:list >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [*] Launching browser for Firebase login...
    call firebase login
) else (
    echo [OK] Already logged into Firebase.
)
echo.

:: Step 7: Firebase Project Setup
echo [*] Verifying Firebase configuration...
if not exist "firebase.json" (
    echo [!] firebase.json not found, initializing hosting...
    call firebase init hosting
) else (
    echo [OK] firebase.json detected.
)
echo.

:: Step 8: Production Build
echo [*] Compiling production build (TypeScript + Vite multi-page)...
call npm run build
if %ERRORLEVEL% neq 0 (
    color 0C
    echo [ERROR] Build failed! Check the console output above.
    pause
    exit /b 1
)
echo [OK] Production build created in .\dist directory.
echo.

:: Step 9: Deploy to Firebase Hosting
echo [*] Deploying to Firebase Hosting...
call firebase deploy --only hosting
if %ERRORLEVEL% neq 0 (
    color 0C
    echo [ERROR] Firebase deploy failed! Ensure your Firebase project ID is configured in .firebaserc
    echo You can associate your project by running: firebase use --add
    pause
    exit /b 1
)

echo.
color 0A
echo ===============================================================================
echo [SUCCESS] SuperTools has been successfully built and deployed to Firebase!
echo ===============================================================================
echo.
pause
