import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaGlobe } from 'react-icons/fa';

const Footer = () => {
  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/alexjohnson',
      icon: FaGithub,
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/in/alexjohnson-dev',
      icon: FaLinkedin,
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/alexjohnsondev',
      icon: FaTwitter,
    },
    {
      name: 'Website',
      href: 'https://alexjohnson.dev',
      icon: FaGlobe,
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container">
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Left side */}
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600 text-sm">
                © 2024 Alex Johnson. Built with React, Node.js, and passion.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex space-x-6">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={link.name}
                >
                  <link.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* API Status */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center md:justify-start">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">API Status: Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;