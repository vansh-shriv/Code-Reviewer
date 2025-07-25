from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import ast
import json
import re
from werkzeug.utils import secure_filename
from code_analyzer import PythonAnalyzer, JavaScriptAnalyzer

app = Flask(__name__)
CORS(app,origins=["https://code-reviewer-ahpf.vercel.app"])

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'py', 'js'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/analyze', methods=['POST'])
def analyze_code():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type. Only .py and .js files are allowed'}), 400
    
    try:
        # Read file content
        content = file.read().decode('utf-8')
        file_extension = file.filename.rsplit('.', 1)[1].lower()
        
        # Analyze based on file type
        if file_extension == 'py':
            analyzer = PythonAnalyzer()
            issues = analyzer.analyze(content, file.filename)
        elif file_extension == 'js':
            analyzer = JavaScriptAnalyzer()
            issues = analyzer.analyze(content, file.filename)
        else:
            return jsonify({'error': 'Unsupported file type'}), 400
        
        return jsonify({
            'filename': file.filename,
            'content': content,
            'issues': issues,
            'total_issues': len(issues)
        })
    
    except Exception as e:
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Code Reviewer API is running'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 