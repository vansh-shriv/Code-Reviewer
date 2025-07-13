@echo off
echo Starting Offline Code Reviewer...
echo.

echo Installing backend dependencies...
cd backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Failed to install Python dependencies
    pause
    exit /b 1
)

echo Installing Node.js dependencies for JavaScript parsing...
npm install
if %errorlevel% neq 0 (
    echo Failed to install Node.js dependencies
    pause
    exit /b 1
)

echo Starting backend server...
start "Backend Server" python app.py

echo.
echo Installing frontend dependencies...
cd ..\frontend
npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

echo Starting frontend server...
start "Frontend Server" npm run dev

echo.
echo 🎉 Offline AI Code Reviewer is starting up!
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo The application will open automatically in your browser.
echo Press any key to close this window...
pause > nul 