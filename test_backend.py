#!/usr/bin/env python3
"""
Test script for the Offline AI Code Reviewer backend
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from code_analyzer import PythonAnalyzer, JavaScriptAnalyzer

def test_python_analyzer():
    print("Testing Python Analyzer...")
    print("=" * 50)
    
    # Test with the sample Python file
    with open('sample_files/sample.py', 'r') as f:
        content = f.read()
    
    analyzer = PythonAnalyzer()
    issues = analyzer.analyze(content, 'sample.py')
    
    print(f"Found {len(issues)} issues:")
    for issue in issues:
        print(f"  Line {issue['line']}: {issue['type']} - {issue['description']}")
        if issue['suggestion']:
            print(f"    💡 {issue['suggestion']}")
    
    print()

def test_javascript_analyzer():
    print("Testing JavaScript Analyzer...")
    print("=" * 50)
    
    # Test with the sample JavaScript file
    with open('sample_files/sample.js', 'r') as f:
        content = f.read()
    
    analyzer = JavaScriptAnalyzer()
    issues = analyzer.analyze(content, 'sample.js')
    
    print(f"Found {len(issues)} issues:")
    for issue in issues:
        print(f"  Line {issue['line']}: {issue['type']} - {issue['description']}")
        if issue['suggestion']:
            print(f"    💡 {issue['suggestion']}")
    
    print()

if __name__ == "__main__":
    print("🧪 Testing Offline AI Code Reviewer Backend")
    print("=" * 60)
    print()
    
    try:
        test_python_analyzer()
        test_javascript_analyzer()
        print("✅ All tests completed successfully!")
    except Exception as e:
        print(f"❌ Test failed: {e}")
        sys.exit(1) 