/**
 * File Upload Hook
 * 
 * Custom React hook for handling file upload functionality
 * including drag and drop, validation, and state management.
 * 
 * Author: nayandas69
 * Repo: https://github.com/nayandas69/word-to-pdf-converter
 */

import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'

/**
 * Custom hook for file upload functionality
 * 
 * @param {Object} options - Configuration options
 * @param {Array} options.allowedTypes - Array of allowed file extensions
 * @param {number} options.maxSize - Maximum file size in bytes
 * @param {Function} options.onFileSelect - Callback when file is selected
 * @returns {Object} Hook state and methods
 */
export const useFileUpload = (options = {}) => {
  const {
    allowedTypes = ['.doc', '.docx'],
    maxSize = 10 * 1024 * 1024, // 10MB default
    onFileSelect = () => {}
  } = options

  // State
  const [selectedFile, setSelectedFile] = useState(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  /**
   * Validate uploaded file
   * 
   * @param {File} file - File to validate
   * @returns {boolean} Whether file is valid
   */
  const validateFile = useCallback((file) => {
    if (!file) {
      toast.error('No file selected')
      return false
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
    if (!allowedTypes.includes(fileExtension)) {
      toast.error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`)
      return false
    }

    // Check file size
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024))
      toast.error(`File size must be less than ${maxSizeMB}MB`)
      return false
    }

    // Check if file is empty
    if (file.size === 0) {
      toast.error('File is empty')
      return false
    }

    return true
  }, [allowedTypes, maxSize])

  /**
   * Handle file selection
   * 
   * @param {File} file - Selected file
   */
  const handleFileSelect = useCallback((file) => {
    if (validateFile(file)) {
      setSelectedFile(file)
      onFileSelect(file)
      toast.success('File selected successfully!')
    }
  }, [validateFile, onFileSelect])

  /**
   * Handle file input change
   * 
   * @param {Event} event - Input change event
   */
  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }, [handleFileSelect])

  /**
   * Handle drag events
   * 
   * @param {Event} e - Drag event
   */
  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }, [])

  /**
   * Handle file drop
   * 
   * @param {Event} e - Drop event
   */
  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }, [handleFileSelect])

  /**
   * Reset file selection
   */
  const resetFile = useCallback(() => {
    setSelectedFile(null)
    setUploadProgress(0)
    setIsUploading(false)
  }, [])

  /**
   * Format file size for display
   * 
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted file size
   */
  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }, [])

  /**
   * Get file type icon
   * 
   * @param {string} filename - File name
   * @returns {string} Icon class or component
   */
  const getFileIcon = useCallback((filename) => {
    const extension = '.' + filename.split('.').pop().toLowerCase()
    
    switch (extension) {
      case '.doc':
      case '.docx':
        return 'word'
      case '.pdf':
        return 'pdf'
      case '.txt':
        return 'text'
      default:
        return 'file'
    }
  }, [])

  return {
    // State
    selectedFile,
    isDragActive,
    isUploading,
    uploadProgress,
    
    // Methods
    handleFileSelect,
    handleFileChange,
    handleDrag,
    handleDrop,
    resetFile,
    validateFile,
    formatFileSize,
    getFileIcon,
    
    // Setters for external control
    setIsUploading,
    setUploadProgress
  }
}

export default useFileUpload