/**
 * Footer Component
 * 
 * This component renders the footer section with copyright information,
 * links, and additional details about the application.
 * 
 * Author: nayandas69
 * Repo: https://github.com/nayandas69/word-to-pdf-converter
 */

import React from 'react'
import { FaGithub, FaLinkedin, FaTwitter, FaHeart, FaFileWord, FaFilePdf } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  // Social links
  const socialLinks = [
    {
      name: 'GitHub',
      icon: FaGithub,
      url: 'https://github.com/nayandas69',
      color: 'hover:text-gray-900'
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedin,
      url: 'https://linkedin.com/#',
      color: 'hover:text-blue-600'
    },
    {
      name: 'Twitter',
      icon: FaTwitter,
      url: 'https://twitter.com/nayandas69',
      color: 'hover:text-blue-400'
    }
  ]

  // Footer links
  const footerLinks = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '#features' },
        { name: 'How it Works', href: '#converter' },
        { name: 'Privacy Policy', href: '#privacy' },
        { name: 'Terms of Service', href: '#terms' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '#help' },
        { name: 'Contact Us', href: '#contact' },
        { name: 'Bug Report', href: '#bug-report' },
        { name: 'Feature Request', href: '#feature-request' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '#about' },
        { name: 'Blog', href: '#blog' },
        { name: 'Careers', href: '#careers' },
        { name: 'Press Kit', href: '#press' }
      ]
    }
  ]

  return (
    <footer id="about" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <FaFileWord className="text-2xl text-blue-400" />
              <span className="text-xl font-bold">Word</span>
              <span className="text-xl font-bold text-pink-400">To</span>
              <FaFilePdf className="text-2xl text-red-400" />
              <span className="text-xl font-bold">PDF</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              The fastest and most secure way to convert Word documents to PDF online. 
              Built with modern technology for optimal performance.
            </p>
            
            {/* Social links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 ${social.color} transition-colors duration-200 hover:scale-110 transform`}
                  aria-label={social.name}
                >
                  <social.icon className="text-xl" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200 hover:underline"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-gray-400">
              <span>© {currentYear} Word to PDF Converter. Made with</span>
              <FaHeart className="text-red-500 animate-pulse" />
              <span>by</span>
              <a
                href="https://github.com/nayandas69"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-primary-400 font-semibold transition-colors duration-200"
              >
                Nayan Das
              </a>
            </div>

            {/* Additional info */}
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>🔒 SSL Secured</span>
              <span>🚀 Fast & Reliable</span>
              <span>🆓 Always Free</span>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            This service is provided free of charge. Your privacy and security are our top priorities.
            All uploaded files are automatically deleted after conversion.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer