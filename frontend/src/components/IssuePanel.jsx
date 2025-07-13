import React, { useState, useMemo } from 'react'

function IssuePanel({ issues, totalIssues, filename }) {
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('line')

  const issueTypes = [
    { key: 'all', label: 'All Issues', icon: '📋' },
    { key: 'unused_import', label: 'Unused Imports', icon: '❌' },
    { key: 'long_function', label: 'Long Functions', icon: '🔁' },
    { key: 'short_variable_name', label: 'Short Variables', icon: '⚠️' },
    { key: 'naming_convention', label: 'Naming Issues', icon: '🔤' },
    { key: 'file_too_large', label: 'File Size', icon: '📦' },
    { key: 'syntax_error', label: 'Syntax Errors', icon: '🚨' },
    { key: 'parse_error', label: 'Parse Errors', icon: '💥' }
  ]

  const filteredAndSortedIssues = useMemo(() => {
    let filtered = issues
    
    // Filter by type
    if (filterType !== 'all') {
      filtered = issues.filter(issue => issue.type === filterType)
    }
    
    // Sort issues
    filtered.sort((a, b) => {
      if (sortBy === 'line') {
        return a.line - b.line
      } else if (sortBy === 'type') {
        return a.type.localeCompare(b.type)
      } else if (sortBy === 'severity') {
        const severityOrder = {
          'syntax_error': 1,
          'parse_error': 1,
          'unused_import': 2,
          'naming_convention': 3,
          'short_variable_name': 4,
          'long_function': 5,
          'file_too_large': 6
        }
        return (severityOrder[a.type] || 7) - (severityOrder[b.type] || 7)
      }
      return 0
    })
    
    return filtered
  }, [issues, filterType, sortBy])

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

  const scrollToLine = (lineNumber) => {
    // This would scroll the code viewer to the specific line
    // For now, we'll just highlight it in the console
    console.log(`Scroll to line ${lineNumber}`)
  }

  return (
    <div className="card">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Code Issues
        </h2>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{totalIssues} total issues found</span>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            {filename}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Type
          </label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {issueTypes.map(type => (
              <option key={type.key} value={type.key}>
                {type.icon} {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort by
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="line">Line Number</option>
            <option value="type">Issue Type</option>
            <option value="severity">Severity</option>
          </select>
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredAndSortedIssues.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-sm">
              {filterType === 'all' 
                ? 'No issues found! Your code looks great!' 
                : `No ${filterType.replace('_', ' ')} issues found.`
              }
            </p>
          </div>
        ) : (
          filteredAndSortedIssues.map((issue, index) => (
            <div
              key={index}
              className={`issue-card cursor-pointer transition-all duration-200 hover:shadow-lg ${getIssueColor(issue.type)}`}
              onClick={() => scrollToLine(issue.line)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getIssueIcon(issue.type)}</span>
                  <span className="text-sm font-medium text-gray-900">
                    Line {issue.line}
                  </span>
                </div>
                <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                  {issue.type.replace('_', ' ')}
                </span>
              </div>
              
              <p className="text-sm text-gray-700 mb-2">
                {issue.description}
              </p>
              
              {issue.suggestion && (
                <div className="text-xs text-gray-600 bg-white p-2 rounded border-l-2 border-primary-500">
                  <span className="font-medium text-primary-600">💡 Suggestion:</span>
                  <p className="mt-1">{issue.suggestion}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      {totalIssues > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            <div className="flex justify-between items-center">
              <span>Issues shown:</span>
              <span className="font-medium">
                {filteredAndSortedIssues.length} of {totalIssues}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default IssuePanel 