@echo off
echo Reorganizing folder structure...

:: Create new directories
if not exist "src\services" mkdir "src\services"
if not exist "src\lib" mkdir "src\lib"

:: Move API files to services
if exist "src\api" (
    echo Moving src\api to src\services...
    move "src\api\*" "src\services\"
    rmdir "src\api"
)

:: Move supabase-client to lib
if exist "src\supabase-client.ts" (
    echo Moving src\supabase-client.ts to src\lib...
    move "src\supabase-client.ts" "src\lib\"
)

echo.
echo Folder structure updated successfully!
pause
