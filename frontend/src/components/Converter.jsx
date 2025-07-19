/**
 * Converter Component
 * 
 * This is the main component that handles file upload, conversion,
 * and download functionality. It provides a user-friendly interface
 * for converting Word documents to PDF.
 * 
 * Author: nayandas69
 * Repo: https://github.com/nayandas69/word-to-pdf-converter
 */

import React, { useState, useRef } from 'react'
import { FaFileWord, FaCloudUploadAlt, FaSpinner, FaCheckCircle, FaTimesCircle, FaDownload } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { convertWordToPdf } from '../utils/api'

const Converter = () => {
  // State management
  const [selectedFile, setSelectedFile] = useState(null)
  const [isConverting, setIsConverting] = useState(false)
  const [conversionStatus, setConversionStatus] = useState(null) // 'success', 'error', null
  const [dragActive, setDragActive] = useState(false)
  
  // File input reference
  const fileInputRef = useRef(null)

  // Handle file selection
  const handleFileSelect = (file) => {
    // Validate file type
    const allowedTypes = ['.doc', '.docx']
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
    
    if (!allowedTypes.includes(fileExtension)) {
      toast.error('Please select a valid Word document (.doc or .docx)')
      return
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB')
      return
    }

    setSelectedFile(file)
    setConversionStatus(null)
    toast.success('File selected successfully!')
  }

  // Handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  // Handle file conversion
  const handleConvert = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first')
      return
    }

    setIsConverting(true)
    setConversionStatus(null)

    try {
      // Show loading toast
      const loadingToast = toast.loading('Converting your document...')

      // Call API to convert file
      await convertWordToPdf(selectedFile)

      // Success
      toast.dismiss(loadingToast)
      toast.success('Document converted successfully!')
      setConversionStatus('success')
      
      // Reset file selection after successful conversion
      setTimeout(() => {
        setSelectedFile(null)
        setConversionStatus(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }, 3000)

    } catch (error) {
      console.error('Conversion error:', error)
      toast.error(error.message || 'Failed to convert document. Please try again.')
      setConversionStatus('error')
    } finally {
      setIsConverting(false)
    }
  }

  // Reset file selection
  const resetFile = () => {
    setSelectedFile(null)
    setConversionStatus(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <section id="converter" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Convert Your Document
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your Word document and convert it to PDF in seconds. 
            Supports both .doc and .docx formats.
          </p>
        </div>

        {/* Converter card */}
        <div className="card max-w-2xl mx-auto">
          {/* File upload area */}
          <div
            className={`input-file ${dragActive ? 'border-primary-500 bg-primary-100' : ''} ${
              selectedFile ? 'border-green-400 bg-green-50' : ''
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              disabled={isConverting}
            />

            <div className="text-center">
              {selectedFile ? (
                // File selected state
                <div className="space-y-4">
                  <FaCheckCircle className="text-4xl text-green-500 mx-auto" />
                  <div>
                    <p className="text-lg font-semibold text-gray-800 mb-1">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      resetFile()
                    }}
                    className="text-sm text-red-600 hover:text-red-700 underline"
                    disabled={isConverting}
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                // Default upload state
                <div className="space-y-4">
                  <FaCloudUploadAlt className="text-5xl text-primary-400 mx-auto" />
                  <div>
                    <p className="text-lg font-semibold text-gray-800 mb-2">
                      Drop your Word document here
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      or click to browse files
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
                      <FaFileWord />
                      <span>Supports .doc and .docx files up to 10MB</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Conversion status */}
          {conversionStatus && (
            <div className={`mt-6 p-4 rounded-lg flex items-center space-x-3 ${
              conversionStatus === 'success' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {conversionStatus === 'success' ? (
                <>
                  <FaCheckCircle className="text-xl" />
                  <div>
                    <p className="font-semibold">Conversion Successful!</p>
                    <p className="text-sm">Your PDF has been downloaded automatically.</p>
                  </div>
                </>
              ) : (
                <>
                  <FaTimesCircle className="text-xl" />
                  <div>
                    <p className="font-semibold">Conversion Failed</p>
                    <p className="text-sm">Please try again or contact support.</p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Convert button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleConvert}
              disabled={!selectedFile || isConverting}
              className={`btn-primary px-8 py-3 text-lg ${
                isConverting ? 'cursor-not-allowed' : ''
              }`}
            >
              {isConverting ? (
                <div className="flex items-center space-x-2">
                  <FaSpinner className="animate-spin" />
                  <span>Converting...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <FaDownload />
                  <span>Convert to PDF</span>
                </div>
              )}
            </button>
          </div>

          {/* Help text */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Your files are processed securely and deleted automatically after conversion.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Converter