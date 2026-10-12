@echo off
setlocal
cd /d "%~dp0"
echo ARIA 4X Offline Bundle Builder
where node >nul 2>&1
if errorlevel 1 (
  echo ERROR: Node.js was not found. Install Node.js and run this again.
  pause
  exit /b 1
)
where py >nul 2>&1
if not errorlevel 1 (
  py -3 "%~dp0BuildBundleGUI.py"
) else (
  where python >nul 2>&1
  if errorlevel 1 (
    echo ERROR: Python 3 was not found. Install Python 3 and run again.
    pause
    exit /b 1
  )
  python "%~dp0BuildBundleGUI.py"
)
if errorlevel 1 (
  echo Builder exited with an error. Check the messages above.
  pause
)
endlocal
