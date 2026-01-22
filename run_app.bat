@echo off
echo Installing dependencies...
call npm install --legacy-peer-deps

echo Starting development server...
echo The app will open at http://localhost:5173
call npm run dev
pause
