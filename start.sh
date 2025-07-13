#!/bin/bash

echo "Starting Offline Code Reviewer..."
echo

echo "Installing backend dependencies..."
cd backend
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "Failed to install Python dependencies"
    exit 1
fi

echo "Installing Node.js dependencies for JavaScript parsing..."
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install Node.js dependencies"
    exit 1
fi

echo "Starting backend server..."
python app.py &
BACKEND_PID=$!

echo
echo "Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install frontend dependencies"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo "Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

echo
echo "🎉 Offline AI Code Reviewer is starting up!"
echo
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo
echo "Press Ctrl+C to stop both servers..."

# Wait for user to stop
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait 