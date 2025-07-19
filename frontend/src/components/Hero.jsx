/**
 * Hero Component
 * 
 * This component renders the hero section with the main heading,
 * description, and call-to-action elements.
 * 
 * Author: nayandas69
 * Repo: https://github.com/nayandas69/word-to-pdf-converter
 */

import React from 'react'
import { FaArrowDown, FaFileWord, FaFilePdf, FaArrowRight } from 'react-icons/fa'

const Hero = () => {
  // Scroll to converter section
  const scrollToConverter = () => {
    const element = document.querySelector('#converter')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="home" className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          {/* Main heading */}
          <div className="animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Convert{' '}
              <span className="text-gradient">Word to PDF</span>
              <br />
              <span className="text-3xl sm:text-4xl lg:text-5xl">Online & Free</span>
            </h1>
          </div>

          {/* Description */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your Word documents into professional PDF files instantly. 
              No software installation required, completely secure, and absolutely free.
            </p>
          </div>

          {/* Visual conversion flow */}
          <div className="animate-fade-in-up mb-12" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-center space-x-4 sm:space-x-8">
              {/* Word file icon */}
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 p-4 rounded-full mb-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <FaFileWord className="text-3xl sm:text-4xl text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">.DOC / .DOCX</span>
              </div>

              {/* Arrow */}
              <div className="flex flex-col items-center">
                <FaArrowRight className="text-2xl text-gray-400 animate-pulse" />
                <span className="text-xs text-gray-500 mt-1">Convert</span>
              </div>

              {/* PDF file icon */}
              <div className="flex flex-col items-center">
                <div className="bg-red-100 p-4 rounded-full mb-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <FaFilePdf className="text-3xl sm:text-4xl text-red-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">.PDF</span>
              </div>
            </div>
          </div>

          {/* Call to action button */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <button
              onClick={scrollToConverter}
              className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
            >
              <span className="mr-2">Start Converting Now</span>
              <FaArrowDown className="group-hover:translate-y-1 transition-transform duration-300" />
            </button>
          </div>

          {/* Trust indicators */}
          <div className="animate-fade-in-up mt-12" style={{ animationDelay: '0.8s' }}>
            <div className="flex flex-wrap justify-center items-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>100% Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>No Registration</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Fast Processing</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Free Forever</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero