import React, { useCallback, useState } from 'react'

function FileUpload({ onFileUpload, loading, error }) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      handleFileSelect(file)
    }
  }, [])

  const handleFileSelect = (file) => {
    const allowedTypes = ['.js', '.py']
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
    
    if (!allowedTypes.includes(fileExtension)) {
      alert('Please select a .js or .py file')
      return
    }
    
    setSelectedFile(file)
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (selectedFile) {
      onFileUpload(selectedFile)
    }
  }

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase()
    return ext === 'py' ? '🐍' : '📄'
  }

  return (
    <div className="card">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Upload Your Code File
        </h2>
        <p className="text-gray-600">
          Drag and drop or click to select a .js or .py file
        </p>
      </div>

      {/* Drag & Drop Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
          dragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {!selectedFile ? (
          <div>
            <div className="text-4xl mb-4">📁</div>
            <p className="text-gray-600 mb-4">
              Drag and drop your file here, or{' '}
              <label className="text-primary-600 hover:text-primary-700 cursor-pointer font-medium">
                browse files
                <input
                  type="file"
                  accept=".js,.py"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
            </p>
            <p className="text-sm text-gray-500">
              Supported formats: .js, .py
            </p>
          </div>
        ) : (
          <div>
            <div className="text-4xl mb-4">{getFileIcon(selectedFile.name)}</div>
            <p className="text-gray-900 font-medium mb-2">{selectedFile.name}</p>
            <p className="text-sm text-gray-500 mb-4">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
            <div className="space-x-3">
              <button
                onClick={handleUpload}
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Analyze Code'}
              </button>
              <button
                onClick={() => setSelectedFile(null)}
                className="btn-secondary"
              >
                Choose Different File
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mt-4 text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          <p className="text-gray-600 mt-2">Analyzing your code...</p>
        </div>
      )}
    </div>
  )
}

export default FileUpload 