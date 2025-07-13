import React from 'react'

function CodeViewer({ fileData, issues, onClear }) {
  const getLanguageClass = (extension) => {
    return extension === 'py' ? 'language-python' : 'language-javascript'
  }

  const getIssueForLine = (lineNumber) => {
    return issues.find(issue => issue.line === lineNumber)
  }

  const getIssueIcon = (issueType) => {
    const icons = {
      'unused_import': '❌',
      'long_function': '🔁',
      'short_variable_name': '⚠️',
      'naming_convention': '🔤',
      'file_too_large': '📦',
      'syntax_error': '🚨',
      'parse_error': '💥'
    }
    return icons[issueType] || '💡'
  }

  const getIssueColor = (issueType) => {
    const colors = {
      'unused_import': 'border-red-200 bg-red-50',
      'long_function': 'border-yellow-200 bg-yellow-50',
      'short_variable_name': 'border-orange-200 bg-orange-50',
      'naming_convention': 'border-blue-200 bg-blue-50',
      'file_too_large': 'border-purple-200 bg-purple-50',
      'syntax_error': 'border-red-300 bg-red-100',
      'parse_error': 'border-red-300 bg-red-100'
    }
    return colors[issueType] || 'border-gray-200 bg-gray-50'
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {fileData.name}
          </h2>
          <p className="text-sm text-gray-500">
            {fileData.content.split('\n').length} lines • {fileData.extension.toUpperCase()}
          </p>
        </div>
        <button
          onClick={onClear}
          className="btn-secondary"
        >
          Upload New File
        </button>
      </div>

      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-300 text-sm ml-2">
              {fileData.name}
            </span>
          </div>
        </div>
        
        <div className="p-4 overflow-x-auto">
          <div className="font-mono text-sm">
            {fileData.content.split('\n').map((line, index) => {
              const lineNumber = index + 1
              const issue = getIssueForLine(lineNumber)
              
              return (
                <div
                  key={index}
                  className={`flex items-start group hover:bg-gray-800 transition-colors duration-150 ${
                    issue ? getIssueColor(issue.type) : ''
                  }`}
                >
                  <div className="flex-shrink-0 w-12 text-right pr-3">
                    <span className="line-number text-gray-500">
                      {lineNumber}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start">
                      <pre className="code-line text-gray-300 whitespace-pre-wrap break-words">
                        {line || ' '}
                      </pre>
                      
                      {issue && (
                        <div className="ml-2 flex-shrink-0">
                          <span className="text-lg" title={`${issue.type}: ${issue.description}`}>
                            {getIssueIcon(issue.type)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {issue && (
                      <div className="mt-1 text-xs text-gray-400 bg-gray-800 p-2 rounded">
                        <div className="font-medium text-gray-300">
                          {issue.description}
                        </div>
                        {issue.suggestion && (
                          <div className="mt-1 text-gray-400">
                            💡 {issue.suggestion}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CodeViewer 