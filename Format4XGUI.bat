@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>&1
if not errorlevel 1 (
    py -3 --version >nul 2>&1
    if not errorlevel 1 goto usepy
)
where python >nul 2>&1
if not errorlevel 1 (
    python --version >nul 2>&1
    if not errorlevel 1 goto usepython
)
echo ERROR: Python 3.10 or newer is needed and must be on PATH.
echo Install Python separately; NO Python packages, NPM packages, or internet downloads are performed by this tool.
pause
exit /b 1
:usepy
py -3 "%~dp0Format4XGUI.py" %*
if errorlevel 1 pause
exit /b %errorlevel%
:usepython
python "%~dp0Format4XGUI.py" %*
if errorlevel 1 pause
exit /b %errorlevel%
