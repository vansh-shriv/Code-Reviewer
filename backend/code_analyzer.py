import ast
import re
import json
import subprocess
import tempfile
import os
from typing import List, Dict, Any

class BaseAnalyzer:
    def __init__(self):
        self.issues = []
    
    def add_issue(self, line_number: int, issue_type: str, description: str, suggestion: str = ""):
        self.issues.append({
            'line': line_number,
            'type': issue_type,
            'description': description,
            'suggestion': suggestion
        })
    
    def analyze(self, content: str, filename: str) -> List[Dict[str, Any]]:
        raise NotImplementedError

class PythonAnalyzer(BaseAnalyzer):
    def analyze(self, content: str, filename: str) -> List[Dict[str, Any]]:
        self.issues = []
        lines = content.split('\n')
        
        # Check file size
        if len(lines) > 300:
            self.add_issue(
                1, 
                'file_too_large', 
                f'File has {len(lines)} lines (over 300 line limit)',
                'Consider breaking this file into smaller modules'
            )
        
        try:
            tree = ast.parse(content)
            self._analyze_ast(tree, lines)
        except SyntaxError as e:
            self.add_issue(e.lineno or 1, 'syntax_error', f'Syntax error: {e.msg}')
        except Exception as e:
            self.add_issue(1, 'parse_error', f'Failed to parse file: {str(e)}')
        
        return self.issues
    
    def _analyze_ast(self, tree: ast.AST, lines: List[str]):
        # Collect imports and their usage
        imports = set()
        used_names = set()
        
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                for alias in node.names:
                    imports.add(alias.name)
            elif isinstance(node, ast.ImportFrom):
                if node.module:
                    imports.add(node.module)
            elif isinstance(node, ast.Name):
                used_names.add(node.id)
            elif isinstance(node, ast.FunctionDef):
                self._analyze_function(node, lines)
            elif isinstance(node, ast.Assign):
                self._analyze_assignments(node, lines)
        
        # Check for unused imports
        for import_name in imports:
            if import_name not in used_names:
                # Find the line number of the import
                for i, line in enumerate(lines, 1):
                    if f'import {import_name}' in line or f'from {import_name}' in line:
                        self.add_issue(
                            i,
                            'unused_import',
                            f'Unused import: {import_name}',
                            f'Remove the import statement for {import_name}'
                        )
                        break
    
    def _analyze_function(self, node: ast.FunctionDef, lines: List[str]):
        # Check function name convention (snake_case)
        if not re.match(r'^[a-z][a-z0-9_]*$', node.name):
            self.add_issue(
                node.lineno,
                'naming_convention',
                f'Function name "{node.name}" should be snake_case',
                f'Rename function to use snake_case (e.g., {node.name.lower()})'
            )
        
        # Check function length
        if hasattr(node, 'end_lineno') and node.end_lineno:
            function_length = node.end_lineno - node.lineno + 1
            if function_length > 30:
                self.add_issue(
                    node.lineno,
                    'long_function',
                    f'Function "{node.name}" is {function_length} lines long (over 30 line limit)',
                    'Consider breaking this function into smaller functions'
                )
        
        # Check for short variable names in function
        for child in ast.walk(node):
            if isinstance(child, ast.Name) and isinstance(child.ctx, ast.Store):
                if len(child.id) < 3 and child.id not in ['i', 'j', 'k']:
                    self.add_issue(
                        child.lineno,
                        'short_variable_name',
                        f'Variable "{child.id}" has a short name (less than 3 characters)',
                        f'Use a more descriptive variable name instead of "{child.id}"'
                    )
    
    def _analyze_assignments(self, node: ast.Assign, lines: List[str]):
        for target in node.targets:
            if isinstance(target, ast.Name):
                if len(target.id) < 3 and target.id not in ['i', 'j', 'k']:
                    self.add_issue(
                        node.lineno,
                        'short_variable_name',
                        f'Variable "{target.id}" has a short name (less than 3 characters)',
                        f'Use a more descriptive variable name instead of "{target.id}"'
                    )

class JavaScriptAnalyzer(BaseAnalyzer):
    def analyze(self, content: str, filename: str) -> List[Dict[str, Any]]:
        self.issues = []
        lines = content.split('\n')
        
        # Check file size
        if len(lines) > 300:
            self.add_issue(
                1, 
                'file_too_large', 
                f'File has {len(lines)} lines (over 300 line limit)',
                'Consider breaking this file into smaller modules'
            )
        
        try:
            # Use esprima to parse JavaScript
            ast_data = self._parse_javascript(content)
            self._analyze_javascript_ast(ast_data, lines)
        except Exception as e:
            self.add_issue(1, 'parse_error', f'Failed to parse JavaScript: {str(e)}')
        
        return self.issues
    
    def _parse_javascript(self, content: str) -> Dict[str, Any]:
        """Parse JavaScript using esprima via subprocess"""
        try:
            # Create a temporary file with the JavaScript content
            with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False) as temp_file:
                temp_file.write(content)
                temp_file_path = temp_file.name
            
            # Run esprima to parse the JavaScript
            result = subprocess.run([
                'node', '-e', 
                f'''
                const esprima = require('esprima');
                const fs = require('fs');
                const code = fs.readFileSync({json.dumps(temp_file_path)}, 'utf8');
                try {{
                    const ast = esprima.parse(code, {{ loc: true, range: true }});
                    console.log(JSON.stringify(ast));
                }} catch (error) {{
                    console.log(JSON.stringify({{ error: error.message, line: error.lineNumber }}));
                }}
                '''
            ], capture_output=True, text=True, timeout=10)
            
            # Clean up temporary file
            os.unlink(temp_file_path)
            
            # Try to parse stdout as JSON
            try:
                return json.loads(result.stdout)
            except json.JSONDecodeError:
                # If stdout is not valid JSON, try stderr
                try:
                    return json.loads(result.stderr)
                except json.JSONDecodeError:
                    raise Exception("Failed to parse esprima output. Stdout: {} Stderr: {}".format(result.stdout, result.stderr))
            
        except subprocess.TimeoutExpired:
            raise Exception("JavaScript parsing timed out")
        except json.JSONDecodeError:
            raise Exception("Failed to parse esprima output")
        except Exception as e:
            raise Exception(f"JavaScript parsing error: {str(e)}")
    
    def _analyze_javascript_ast(self, ast_data: Dict[str, Any], lines: List[str]):
        """Analyze JavaScript AST for issues"""
        imports = set()
        used_names = set()
        
        def traverse_node(node: Dict[str, Any]):
            if node.get('type') == 'ImportDeclaration':
                for specifier in node.get('specifiers', []):
                    if specifier.get('type') == 'ImportDefaultSpecifier':
                        imports.add(specifier.get('imported', {}).get('name', ''))
                    elif specifier.get('type') == 'ImportSpecifier':
                        imports.add(specifier.get('imported', {}).get('name', ''))
            
            elif node.get('type') == 'VariableDeclarator':
                var_name = node.get('id', {}).get('name', '')
                if var_name and len(var_name) < 3 and var_name not in ['i', 'j', 'k']:
                    line_num = node.get('loc', {}).get('start', {}).get('line', 1)
                    self.add_issue(
                        line_num,
                        'short_variable_name',
                        f'Variable "{var_name}" has a short name (less than 3 characters)',
                        f'Use a more descriptive variable name instead of "{var_name}"'
                    )
            
            elif node.get('type') == 'FunctionDeclaration':
                func_name = node.get('id', {}).get('name', '')
                if func_name:
                    # Check naming convention (camelCase)
                    if not re.match(r'^[a-z][a-zA-Z0-9]*$', func_name):
                        line_num = node.get('loc', {}).get('start', {}).get('line', 1)
                        self.add_issue(
                            line_num,
                            'naming_convention',
                            f'Function name "{func_name}" should be camelCase',
                            f'Rename function to use camelCase (e.g., {func_name[0].lower() + func_name[1:]})'
                        )
                    
                    # Check function length
                    start_line = node.get('loc', {}).get('start', {}).get('line', 1)
                    end_line = node.get('loc', {}).get('end', {}).get('line', 1)
                    function_length = end_line - start_line + 1
                    
                    if function_length > 30:
                        self.add_issue(
                            start_line,
                            'long_function',
                            f'Function "{func_name}" is {function_length} lines long (over 30 line limit)',
                            'Consider breaking this function into smaller functions'
                        )
            
            elif node.get('type') == 'Identifier':
                used_names.add(node.get('name', ''))
            
            # Recursively traverse child nodes
            for key, value in node.items():
                if isinstance(value, dict):
                    traverse_node(value)
                elif isinstance(value, list):
                    for item in value:
                        if isinstance(item, dict):
                            traverse_node(item)
        
        traverse_node(ast_data)
        
        # Check for unused imports
        for import_name in imports:
            if import_name and import_name not in used_names:
                # Find the line number of the import
                for i, line in enumerate(lines, 1):
                    if f'import {import_name}' in line or f'from {import_name}' in line:
                        self.add_issue(
                            i,
                            'unused_import',
                            f'Unused import: {import_name}',
                            f'Remove the import statement for {import_name}'
                        )
                        break 