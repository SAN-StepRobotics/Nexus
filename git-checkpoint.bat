@echo off
REM Git Checkpoint Script - Creates a commit and pushes to GitHub
echo.
echo === Git Checkpoint Script ===
echo.

REM Check if git repo
git status >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Not a git repository!
    pause
    exit /b 1
)

REM Show current status
echo Current Status:
git status --short
echo.

REM Ask for commit message
set /p commit_msg="Enter commit message (or 'cancel' to abort): "
if "%commit_msg%"=="cancel" (
    echo Checkpoint cancelled.
    pause
    exit /b 0
)

REM Stage all changes
echo.
echo Staging all changes...
git add .

REM Create commit
echo Creating commit...
git commit -m "%commit_msg%"
if %errorlevel% neq 0 (
    echo Error: Commit failed!
    pause
    exit /b 1
)

REM Push to remote
echo.
echo Pushing to GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo Warning: Push failed. Your changes are committed locally.
    echo Run 'git push origin main' manually when ready.
    pause
    exit /b 1
)

echo.
echo === Checkpoint Created Successfully! ===
echo Commit: %commit_msg%
echo.
pause