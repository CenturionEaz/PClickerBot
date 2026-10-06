@echo off
title Launch PokeClicker with Remote Debugging
echo ======================================================
echo   Launching PokeClicker Desktop on Debug Port 9222
echo ======================================================
echo.

set EXE_PATH=%LOCALAPPDATA%\Programs\pokeclicker-desktop\PokéClicker.exe

if not exist "%EXE_PATH%" (
    echo [Error] Could not find PokeClicker.exe at:
    echo %EXE_PATH%
    pause
    exit /b 1
)

start "" "%EXE_PATH%" --remote-debugging-port=9222
echo PokeClicker started with --remote-debugging-port=9222!
echo You can now connect with Chrome DevTools or remote_cdp_bot.js.
echo.
timeout /t 3 >nul
