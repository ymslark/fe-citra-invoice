#!/bin/bash

# Hentikan proses preview lama kalau ada
PORT=8000
PID=$(lsof -ti:$PORT)
if [ ! -z "$PID" ]; then
  echo "🔴 Hentikan proses lama di port $PORT..."
  kill -9 $PID
fi

# Build project
echo "🟡 Build Nuxt..."
npm run build

# Jalankan preview
echo "🟢 Jalankan preview di http://localhost:$PORT"
npm run preview -- --port=$PORT

