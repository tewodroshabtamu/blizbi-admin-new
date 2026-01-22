@echo off
echo Attempting to fix Rollup build error...
call npm install @rollup/rollup-win32-x64-msvc --save-optional --legacy-peer-deps
echo Fix applied. Try running run_app.bat again.
pause
