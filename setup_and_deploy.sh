#!/usr/bin/env bash
set -e

echo "==============================================================================="
echo "                SuperTools - Automated Firebase Deployment Script"
echo "==============================================================================="
echo ""

# Step 1: Verify Git
if ! command -v git &> /dev/null; then
    echo "[-] Git is not installed. Please install Git first."
    exit 1
fi
echo "[+] Git detected: $(git --version)"

# Step 2: Verify Node.js and npm
if ! command -v node &> /dev/null; then
    echo "[-] Node.js is not installed. Please install Node.js (v18 or newer)."
    exit 1
fi
if ! command -v npm &> /dev/null; then
    echo "[-] npm is not installed."
    exit 1
fi
echo "[+] Node.js detected: $(node --version)"
echo "[+] npm detected: $(npm --version)"

# Step 3: Verify Firebase CLI
if ! command -v firebase &> /dev/null; then
    echo "[!] Firebase CLI not found. Installing globally via npm..."
    npm install -g firebase-tools
fi
echo "[+] Firebase CLI detected: $(firebase --version)"

# Step 4: Clone Repository (if not already inside it)
if [ ! -f "package.json" ]; then
    echo "[*] Cloning repository from branch arena/0112e70e-supertools..."
    if [ -d "SuperTools" ]; then
        cd SuperTools
    else
        git clone -b arena/0112e70e-supertools https://github.com/codero-sus/SuperTools.git
        cd SuperTools
    fi
fi

# Step 5: Install Dependencies
echo "[*] Installing dependencies with npm install..."
npm install

# Step 6: Authenticate with Firebase
echo "[*] Verifying Firebase login..."
firebase login

# Step 7: Select Project
echo "[*] Listing available Firebase projects:"
firebase projects:list || true
read -p "Enter your Firebase Project ID (or press Enter to skip): " proj_id
if [ -n "$proj_id" ]; then
    firebase use "$proj_id"
fi

# Step 8: Build Application
echo "[*] Compiling production build (TypeScript + Vite)..."
npm run build

# Step 9: Deploy to Firebase Hosting (Note: lowercase 'deploy')
echo "[*] Deploying to Firebase Hosting..."
firebase deploy --only hosting || npx --yes firebase-tools@latest deploy --only hosting

echo ""
echo "==============================================================================="
echo "[+] SuperTools has been successfully built and deployed to Firebase Hosting!"
echo "==============================================================================="
