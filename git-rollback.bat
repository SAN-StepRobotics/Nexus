@echo off
REM Git Rollback Script - Helps rollback to a previous commit
echo.
echo === Git Rollback Helper ===
echo.

REM Check if git repo
git status >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Not a git repository!
    pause
    exit /b 1
)

REM Show current branch
echo Current branch:
git branch --show-current
echo.

REM Show recent commits
echo Recent commits (newest first):
echo ----------------------------------------
git log --oneline -15
echo ----------------------------------------
echo.

echo Options:
echo 1. Rollback to specific commit (local only)
echo 2. Rollback to specific commit (local + remote)
echo 3. Create backup branch and rollback
echo 4. View more commits
echo 5. Cancel
echo.

set /p choice="Enter choice (1-5): "

if "%choice%"=="5" (
    echo Rollback cancelled.
    pause
    exit /b 0
)

if "%choice%"=="4" (
    echo.
    git log --oneline -30
    echo.
    pause
    goto :eof
)

REM Get commit hash
set /p commit_hash="Enter commit hash to rollback to (first 7 characters): "

if "%choice%"=="3" (
    REM Create backup branch
    for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
    set backup_name=backup-%datetime:~0,8%-%datetime:~8,6%
    echo.
    echo Creating backup branch: %backup_name%
    git branch %backup_name%
    echo Backup created.
)

if "%choice%"=="1" (
    echo.
    echo Rolling back locally to %commit_hash%...
    git reset --hard %commit_hash%
    if %errorlevel% eq 0 (
        echo.
        echo === Local Rollback Successful! ===
        echo You are now at commit %commit_hash%
        echo Remote repository is unchanged.
        echo.
        echo To update remote later, run: git push --force origin main
    ) else (
        echo Error: Rollback failed!
    )
)

if "%choice%"=="2" (
    echo.
    echo WARNING: This will rollback both local and remote!
    set /p confirm="Type 'YES' to confirm: "
    if "%confirm%"=="YES" (
        echo.
        echo Rolling back to %commit_hash%...
        git reset --hard %commit_hash%
        if %errorlevel% eq 0 (
            echo Updating remote repository...
            git push --force origin main
            if %errorlevel% eq 0 (
                echo.
                echo === Rollback Complete! ===
                echo Local and remote are now at commit %commit_hash%
            ) else (
                echo Warning: Local rollback successful but remote update failed.
                echo Run 'git push --force origin main' manually.
            )
        ) else (
            echo Error: Rollback failed!
        )
    ) else (
        echo Rollback cancelled.
    )
)

if "%choice%"=="3" (
    echo.
    echo Rolling back locally to %commit_hash%...
    git reset --hard %commit_hash%
    if %errorlevel% eq 0 (
        echo.
        echo === Local Rollback Successful! ===
        echo Backup branch created: %backup_name%
        echo You are now at commit %commit_hash%
    ) else (
        echo Error: Rollback failed!
    )
)

echo.
pause