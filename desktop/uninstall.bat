@echo off
title PokeClicker Desktop Bot - Uninstaller
cd /d "%~dp0"
echo ======================================================
echo   PokeClicker Desktop Client - 1-Click Bot Restore
echo ======================================================
echo.

node inject.js --uninstall

echo.
pause
