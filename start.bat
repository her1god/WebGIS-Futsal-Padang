@echo off
echo ===================================
echo WebGIS Futsal Padang - Quick Start
echo ===================================
echo.

REM Cek apakah node_modules sudah ada
if not exist "node_modules\" (
    echo [1/3] Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo.
        echo ❌ Installation failed!
        echo Please check your internet connection and try again.
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed successfully!
    echo.
) else (
    echo ✅ Dependencies already installed.
    echo.
)

REM Cek apakah .env sudah dikonfigurasi
echo [2/3] Checking configuration...
findstr /C:"DB_PASSWORD=" .env > nul
if errorlevel 1 (
    echo ⚠️  Please configure your .env file first!
    echo Edit the .env file and set your MySQL password.
    pause
    exit /b 1
)
echo ✅ Configuration file found.
echo.

REM Jalankan aplikasi
echo [3/3] Starting application...
echo.
echo Server akan berjalan di: http://localhost:3000
echo Tekan Ctrl+C untuk menghentikan server
echo.
echo ===================================
echo.

call npm start
