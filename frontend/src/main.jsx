/**
 * Main entry point for the React application
 * 
 * This file initializes the React app and renders it to the DOM.
 * It also sets up global styles and any necessary providers.
 * 
 * Author: nayandas69
 * Repo: https://github.com/nayandas69/word-to-pdf-converter
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Create root element and render the app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)