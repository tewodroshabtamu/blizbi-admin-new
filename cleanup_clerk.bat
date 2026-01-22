@echo off
echo Uninstalling Clerk...
call npm uninstall @clerk/clerk-react --legacy-peer-deps
echo.
echo Clerk uninstalled!
pause
