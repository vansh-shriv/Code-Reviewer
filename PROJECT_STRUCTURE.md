# Project Structure

```
Offline AI Code Reviewer/
├── README.md                 # Main project documentation
├── PROJECT_STRUCTURE.md      # This file - project structure overview
├── start.bat                 # Windows startup script
├── start.sh                  # Unix/Linux startup script
├── test_backend.py           # Backend testing script
│
├── backend/                 # Python Flask backend
│   ├── app.py               # Main Flask application
│   ├── code_analyzer.py     # Core analysis logic
│   ├── requirements.txt     # Python dependencies
│   ├── package.json         # Node.js dependencies (for esprima)
│   └── uploads/             # Temporary file upload directory
│
├── frontend/                # React + Vite frontend
│   ├── package.json         # Frontend dependencies
│   ├── vite.config.js       # Vite configuration
│   ├── tailwind.config.js   # TailwindCSS configuration
│   ├── postcss.config.js    # PostCSS configuration
│   ├── index.html           # Main HTML file
│   └── src/
│       ├── main.jsx         # React entry point
│       ├── App.jsx          # Main application component
│       ├── index.css        # Global styles with TailwindCSS
│       └── components/      # React components
│           ├── Header.jsx           # Application header
│           ├── FileUpload.jsx       # File upload component
│           ├── CodeViewer.jsx       # Code display component
│           └── IssuePanel.jsx       # Issues sidebar component
│
└── sample_files/            # Test files for demonstration
    ├── sample.py            # Python file with various issues
    └── sample.js            # JavaScript file with various issues
```

## Key Components

### Backend (`backend/`)
- **`app.py`**: Flask server with file upload and analysis endpoints
- **`code_analyzer.py`**: Core analysis engine with Python and JavaScript analyzers
- **`requirements.txt`**: Python dependencies (Flask, Flask-CORS, etc.)
- **`package.json`**: Node.js dependencies (esprima for JavaScript parsing)

### Frontend (`frontend/`)
- **`App.jsx`**: Main application state management and routing
- **`FileUpload.jsx`**: Drag-and-drop file upload with validation
- **`CodeViewer.jsx`**: Syntax-highlighted code display with issue highlighting
- **`IssuePanel.jsx`**: Filterable and sortable issues sidebar
- **`Header.jsx`**: Application header with title and description

### Analysis Rules Implemented

#### Python Files
- ❌ Unused imports detection
- 🔁 Long functions (>30 lines)
- ⚠️ Short variable names (<3 chars, except i,j,k)
- 🔤 Function naming convention (snake_case)
- 📦 File size limit (>300 lines)

#### JavaScript Files
- ❌ Unused imports detection
- 🔁 Long functions (>30 lines)
- ⚠️ Short variable names (<3 chars, except i,j,k)
- 🔤 Function naming convention (camelCase)
- 📦 File size limit (>300 lines)

## Technology Stack

- **Backend**: Python Flask + AST parsing + esprima (Node.js)
- **Frontend**: React 18 + Vite + TailwindCSS
- **Analysis**: Python ast module + esprima JavaScript parser
- **Styling**: TailwindCSS with custom components
- **Build Tools**: Vite for frontend, pip for backend

## Getting Started

1. **Windows**: Run `start.bat`
2. **Unix/Linux**: Run `./start.sh` (make executable first: `chmod +x start.sh`)
3. **Manual**: Follow instructions in README.md

## Testing

Run `python test_backend.py` to test the analysis engine with sample files. 