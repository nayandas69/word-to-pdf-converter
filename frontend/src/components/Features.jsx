/**
 * Features Component
 * 
 * This component displays the key features and benefits
 * of the Word to PDF converter application.
 * 
 * Author: nayandas69
 * Repo: https://github.com/nayandas69/word-to-pdf-converter
 */

import React from 'react'
import { 
  FaShieldAlt, 
  FaRocket, 
  FaGlobe, 
  FaFileAlt, 
  FaCloudDownloadAlt, 
  FaMobile,
  FaLock,
  FaCheckCircle
} from 'react-icons/fa'

const Features = () => {
  // Features data
  const features = [
    {
      icon: FaShieldAlt,
      title: '100% Secure',
      description: 'Your files are processed securely and automatically deleted after conversion. We never store your documents.',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: FaRocket,
      title: 'Lightning Fast',
      description: 'Convert your Word documents to PDF in seconds. Our optimized servers ensure quick processing.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: FaGlobe,
      title: 'No Software Required',
      description: 'Works entirely in your browser. No downloads, installations, or registrations needed.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: FaFileAlt,
      title: 'High Quality Output',
      description: 'Maintains original formatting, fonts, and layout. Professional PDF output every time.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      icon: FaMobile,
      title: 'Mobile Friendly',
      description: 'Works perfectly on all devices - desktop, tablet, and mobile. Convert anywhere, anytime.',
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    },
    {
      icon: FaCloudDownloadAlt,
      title: 'Instant Download',
      description: 'Your converted PDF is ready for download immediately. No waiting, no queues.',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ]

  // Additional benefits
  const benefits = [
    'Supports both .doc and .docx formats',
    'Preserves original document formatting',
    'No file size limitations (up to 10MB)',
    'Free to use with no hidden costs',
    'Works with all modern browsers',
    'Privacy-focused - files deleted after conversion'
  ]

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our Converter?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Experience the fastest, most secure, and reliable Word to PDF conversion 
            service available online. Built with modern technology for optimal performance.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className={`${feature.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`text-xl ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Benefits section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Benefits list */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Everything You Need
              </h3>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security highlight */}
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-6">
              <div className="text-center">
                <FaLock className="text-4xl text-primary-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  Privacy First
                </h4>
                <p className="text-gray-600 mb-4">
                  We take your privacy seriously. All uploaded files are automatically 
                  deleted from our servers after conversion.
                </p>
                <div className="bg-white rounded-lg p-3 text-sm text-gray-500">
                  <strong>Auto-delete:</strong> Files removed within 1 hour
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features