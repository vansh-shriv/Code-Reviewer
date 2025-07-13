import React from 'react'

function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎯 Offline AI Code Reviewer
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload your JavaScript or Python files and get instant code review suggestions 
            based on static analysis. No external APIs required - everything runs locally!
          </p>
        </div>
      </div>
    </header>
  )
}

export default Header 