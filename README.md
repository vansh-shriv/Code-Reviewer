# IMP: for now python files are working fine, for js file I am working on it and some minor improvements.
# for now , basic structure is there , will imporve the UI/UX 


# Offline Code Reviewer

A local web application that provides code review suggestions based on static analysis for JavaScript and Python files.

## Features

- 📁 Upload .js or .py files
- 🔍 Static code analysis without external APIs
- 📋 Display code issues with line numbers and descriptions
- 💡 Suggested fixes for common issues
- 🎨 Modern UI with TailwindCSS

## Code Analysis Rules

### Python Files
- ❌ Unused imports
- 🔁 Long functions (over 30 lines)
- ⚠️ Variables with names < 3 characters (except i, j, k)
- 🔤 Function names should be snake_case
- 📦 File too big (over 300 lines)

### JavaScript Files
- ❌ Unused imports
- 🔁 Long functions (over 30 lines)
- ⚠️ Variables with names < 3 characters (except i, j, k)
- 🔤 Function names should be camelCase
- 📦 File too big (over 300 lines)

## Tech Stack

- **Frontend**: Vite + React + TailwindCSS
- **Backend**: Python Flask
- **Analysis**: AST parsing (ast module for Python, esprima for JS)

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+

### Installation

1. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## Usage

1. Open the web app in your browser
2. Click "Upload File" and select a .js or .py file
3. View the code content and analysis results
4. Review issues in the side panel with line numbers and suggestions

## Example

Upload this Python file:
```python
import os
import sys

def foo():
    x = 1
    y = 2
    return x
```

The web-app will flag:
- `sys` is an unused import
- Variable `x` and `y` have short names
