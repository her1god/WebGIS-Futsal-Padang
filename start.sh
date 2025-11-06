#!/bin/bash

echo "==================================="
echo "WebGIS Futsal Padang - Quick Start"
echo "==================================="
echo ""

# Cek apakah node_modules sudah ada
if [ ! -d "node_modules" ]; then
    echo "[1/3] Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo ""
        echo "❌ Installation failed!"
        echo "Please check your internet connection and try again."
        exit 1
    fi
    echo "✅ Dependencies installed successfully!"
    echo ""
else
    echo "✅ Dependencies already installed."
    echo ""
fi

# Cek apakah .env sudah dikonfigurasi
echo "[2/3] Checking configuration..."
if ! grep -q "DB_PASSWORD=" .env; then
    echo "⚠️  Please configure your .env file first!"
    echo "Edit the .env file and set your MySQL password."
    exit 1
fi
echo "✅ Configuration file found."
echo ""

# Jalankan aplikasi
echo "[3/3] Starting application..."
echo ""
echo "Server akan berjalan di: http://localhost:3000"
echo "Tekan Ctrl+C untuk menghentikan server"
echo ""
echo "==================================="
echo ""

npm start
