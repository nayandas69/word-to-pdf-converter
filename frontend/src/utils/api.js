/**
 * API Utilities
 * 
 * This module contains functions for making API calls to the backend server.
 * It handles file upload, conversion requests, and error handling.
 * 
 * Author: nayandas69
 * Repo: https://github.com/nayandas69/word-to-pdf-converter
 */

import axios from 'axios'

// API base URL - can be configured via environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds timeout for file conversion
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('❌ API Response Error:', error)
    
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response
      console.error(`Server Error ${status}:`, data)
      
      // Return a user-friendly error message
      const message = data?.message || `Server error (${status})`
      return Promise.reject(new Error(message))
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.request)
      return Promise.reject(new Error('Network error. Please check your connection and try again.'))
    } else {
      // Something else happened
      console.error('Request Setup Error:', error.message)
      return Promise.reject(new Error('Request failed. Please try again.'))
    }
  }
)

/**
 * Convert Word document to PDF
 * 
 * @param {File} file - The Word document file to convert
 * @returns {Promise} Promise that resolves when conversion is complete
 */
export const convertWordToPdf = async (file) => {
  try {
    // Validate file
    if (!file) {
      throw new Error('No file provided')
    }

    // Check file type
    const allowedTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please select a Word document (.doc or .docx)')
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB')
    }

    // Create FormData object
    const formData = new FormData()
    formData.append('file', file)

    console.log(`📄 Converting file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`)

    // Make API request
    const response = await apiClient.post('/convert', formData, {
      responseType: 'blob', // Important for file download
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        console.log(`📤 Upload progress: ${percentCompleted}%`)
      },
    })

    // Handle successful response
    if (response.data) {
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      
      // Generate filename for downloaded PDF
      const originalName = file.name.replace(/\.[^/.]+$/, '') // Remove extension
      const pdfFilename = `${originalName}.pdf`
      link.setAttribute('download', pdfFilename)
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      console.log(`✅ File converted and downloaded: ${pdfFilename}`)
      return { success: true, filename: pdfFilename }
    } else {
      throw new Error('No data received from server')
    }

  } catch (error) {
    console.error('❌ Conversion failed:', error)
    
    // Re-throw with user-friendly message
    if (error.message) {
      throw error
    } else {
      throw new Error('Conversion failed. Please try again.')
    }
  }
}

/**
 * Check API health status
 * 
 * @returns {Promise} Promise that resolves with health status
 */
export const checkApiHealth = async () => {
  try {
    const response = await apiClient.get('/health')
    return response.data
  } catch (error) {
    console.error('❌ Health check failed:', error)
    throw error
  }
}

/**
 * Get supported file formats
 * 
 * @returns {Array} Array of supported file formats
 */
export const getSupportedFormats = () => {
  return [
    {
      extension: '.doc',
      mimeType: 'application/msword',
      description: 'Microsoft Word 97-2003 Document'
    },
    {
      extension: '.docx',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      description: 'Microsoft Word Document'
    }
  ]
}

export default apiClient