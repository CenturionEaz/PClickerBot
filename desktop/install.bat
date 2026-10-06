@echo off
title PokeClicker Desktop Bot - Installer
cd /d "%~dp0"
echo ======================================================
echo    PokeClicker Desktop Client - 1-Click Bot Installer
echo ======================================================
echo.

node inject.js --install
node install_permanent_hook.js

echo.
pause
