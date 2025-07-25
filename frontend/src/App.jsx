import React, { useState } from 'react'
import FileUpload from './components/FileUpload'
import CodeViewer from './components/CodeViewer'
import IssuePanel from './components/IssuePanel'
import Header from './components/Header'
const API = import.meta.env.VITE_API_URL;

function App() {
  const [fileData, setFileData] = useState(null)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFileUpload = async (file) => {
    setLoading(true)
    setError(null)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch("https://code-reviewer-xx9q.onrender.com//analyze", {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze file')
      }
      
      const result = await response.json()
      setFileData({
        name: result.filename,
        content: result.content,
        extension: result.filename.split('.').pop().toLowerCase()
      })
      setAnalysisResult(result)
    } catch (err) {
      setError(err.message)
      console.error('Analysis error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setFileData(null)
    setAnalysisResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {!fileData ? (
          <div className="max-w-2xl mx-auto">
            <FileUpload onFileUpload={handleFileUpload} loading={loading} error={error} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Code Viewer - Takes 2/3 of the space */}
            <div className="lg:col-span-2">
              <CodeViewer 
                fileData={fileData} 
                issues={analysisResult?.issues || []}
                onClear={handleClear}
              />
            </div>
            
            {/* Issue Panel - Takes 1/3 of the space */}
            <div className="lg:col-span-1">
              <IssuePanel 
                issues={analysisResult?.issues || []}
                totalIssues={analysisResult?.totalIssues || 0}
                filename={fileData.name}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App 