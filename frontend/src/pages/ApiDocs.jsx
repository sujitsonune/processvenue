import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { ClipboardDocumentIcon, CheckIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ApiDocs = () => {
  const [apiHealth, setApiHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedEndpoint, setCopiedEndpoint] = useState('');

  useEffect(() => {
    fetchApiHealth();
  }, []);

  const fetchApiHealth = async () => {
    try {
      const response = await apiService.health();
      setApiHealth(response.data);
    } catch (error) {
      console.error('Failed to fetch API health:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text, endpoint) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedEndpoint(endpoint);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopiedEndpoint(''), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const endpoints = [
    {
      category: 'System',
      endpoints: [
        {
          method: 'GET',
          path: '/api/health',
          description: 'Get API health status and system information',
          example: `curl -X GET "http://localhost:3000/api/health"`,
          response: `{
  "success": true,
  "message": "API is healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "environment": "development",
  "version": "1.0.0",
  "database": {
    "status": "connected",
    "dialect": "sqlite"
  },
  "memory": {
    "used": "45 MB",
    "total": "128 MB"
  }
}`
        }
      ]
    },
    {
      category: 'Profile',
      endpoints: [
        {
          method: 'GET',
          path: '/api/profile',
          description: 'Retrieve complete profile information',
          example: `curl -X GET "http://localhost:3000/api/profile"`,
          response: `{
  "success": true,
  "data": {
    "id": 1,
    "name": "Alex Johnson",
    "email": "alex.johnson@example.com",
    "bio": "Full-stack developer...",
    "title": "Senior Full-Stack Developer",
    "location": "San Francisco, CA",
    "github_url": "https://github.com/alexjohnson",
    "linkedin_url": "https://linkedin.com/in/alexjohnson-dev",
    "work_experiences": [...],
    "educations": [...]
  }
}`
        },
        {
          method: 'POST',
          path: '/api/profile',
          description: 'Create a new profile',
          example: `curl -X POST "http://localhost:3000/api/profile" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "Experienced developer",
    "title": "Software Engineer"
  }'`,
          response: `{
  "success": true,
  "message": "Profile created successfully",
  "data": { ... }
}`
        },
        {
          method: 'PUT',
          path: '/api/profile',
          description: 'Update entire profile',
          example: `curl -X PUT "http://localhost:3000/api/profile" \\
  -H "Content-Type: application/json" \\
  -d '{ "name": "Updated Name", ... }'`
        },
        {
          method: 'PATCH',
          path: '/api/profile',
          description: 'Partially update profile',
          example: `curl -X PATCH "http://localhost:3000/api/profile" \\
  -H "Content-Type: application/json" \\
  -d '{ "bio": "Updated bio only" }'`
        }
      ]
    },
    {
      category: 'Skills',
      endpoints: [
        {
          method: 'GET',
          path: '/api/skills',
          description: 'List all skills with optional filtering',
          parameters: [
            { name: 'category', type: 'string', description: 'Filter by skill category' },
            { name: 'proficiency', type: 'string', description: 'Filter by proficiency level' },
            { name: 'featured', type: 'boolean', description: 'Filter featured skills' },
            { name: 'limit', type: 'integer', description: 'Number of results (max 100)' },
            { name: 'offset', type: 'integer', description: 'Pagination offset' }
          ],
          example: `curl -X GET "http://localhost:3000/api/skills?category=Programming%20Languages&proficiency=Expert&limit=10"`,
          response: `{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "JavaScript",
      "category": "Programming Languages",
      "proficiency_level": "Expert",
      "years_of_experience": 5,
      "is_featured": true,
      "description": "Advanced ES6+ knowledge..."
    }
  ],
  "pagination": {
    "total": 12,
    "limit": 10,
    "offset": 0,
    "pages": 2
  }
}`
        },
        {
          method: 'GET',
          path: '/api/skills/top',
          description: 'Get featured/top skills',
          parameters: [
            { name: 'limit', type: 'integer', description: 'Number of results (default: 10)' }
          ],
          example: `curl -X GET "http://localhost:3000/api/skills/top?limit=5"`
        },
        {
          method: 'POST',
          path: '/api/skills',
          description: 'Create a new skill',
          example: `curl -X POST "http://localhost:3000/api/skills" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "React",
    "category": "Frameworks",
    "proficiency_level": "Expert",
    "years_of_experience": 4,
    "is_featured": true
  }'`
        }
      ]
    },
    {
      category: 'Projects',
      endpoints: [
        {
          method: 'GET',
          path: '/api/projects',
          description: 'List projects with pagination and filtering',
          parameters: [
            { name: 'skill', type: 'string', description: 'Filter by skill name' },
            { name: 'status', type: 'string', description: 'Filter by project status' },
            { name: 'featured', type: 'boolean', description: 'Filter featured projects' },
            { name: 'limit', type: 'integer', description: 'Number of results (max 100)' },
            { name: 'offset', type: 'integer', description: 'Pagination offset' },
            { name: 'sort', type: 'string', description: 'Sort field (priority, created_at, updated_at, title)' },
            { name: 'order', type: 'string', description: 'Sort order (ASC, DESC)' }
          ],
          example: `curl -X GET "http://localhost:3000/api/projects?skill=react&featured=true&sort=priority&order=DESC"`,
          response: `{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "E-Commerce Platform",
      "description": "Full-featured e-commerce platform...",
      "short_description": "E-commerce platform with React",
      "status": "Completed",
      "priority": 10,
      "is_featured": true,
      "github_url": "https://github.com/...",
      "demo_url": "https://demo.example.com",
      "skills": [
        { "id": 1, "name": "React", "category": "Frameworks" }
      ]
    }
  ],
  "pagination": { ... }
}`
        },
        {
          method: 'GET',
          path: '/api/projects/:id',
          description: 'Get specific project details',
          example: `curl -X GET "http://localhost:3000/api/projects/1"`
        },
        {
          method: 'POST',
          path: '/api/projects',
          description: 'Create a new project',
          example: `curl -X POST "http://localhost:3000/api/projects" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "New Project",
    "description": "Project description",
    "status": "Planning",
    "priority": 7,
    "skills": [
      { "skill_id": 1, "proficiency_used": "Expert" }
    ]
  }'`
        },
        {
          method: 'PUT',
          path: '/api/projects/:id',
          description: 'Update existing project',
          example: `curl -X PUT "http://localhost:3000/api/projects/1" \\
  -H "Content-Type: application/json" \\
  -d '{ "title": "Updated Title", "status": "Completed" }'`
        }
      ]
    },
    {
      category: 'Search',
      endpoints: [
        {
          method: 'GET',
          path: '/api/search',
          description: 'Search across all content types',
          parameters: [
            { name: 'q', type: 'string', required: true, description: 'Search query' },
            { name: 'type', type: 'string', description: 'Content type (all, profile, projects, skills, experience, education)' },
            { name: 'limit', type: 'integer', description: 'Number of results per type' },
            { name: 'offset', type: 'integer', description: 'Pagination offset (for specific types)' }
          ],
          example: `curl -X GET "http://localhost:3000/api/search?q=javascript&type=projects"`,
          response: `{
  "success": true,
  "query": "javascript",
  "total_results": 5,
  "data": {
    "projects": [
      {
        "id": 1,
        "title": "JavaScript Calculator",
        "description": "Advanced calculator built with JavaScript...",
        "skills": [...]
      }
    ],
    "skills": [
      {
        "id": 1,
        "name": "JavaScript",
        "category": "Programming Languages"
      }
    ]
  }
}`
        }
      ]
    }
  ];

  const statusCodes = [
    { code: 200, description: 'OK - Request successful' },
    { code: 201, description: 'Created - Resource created successfully' },
    { code: 400, description: 'Bad Request - Invalid input or validation error' },
    { code: 401, description: 'Unauthorized - Authentication required' },
    { code: 403, description: 'Forbidden - Invalid API key or token' },
    { code: 404, description: 'Not Found - Resource not found' },
    { code: 429, description: 'Too Many Requests - Rate limit exceeded' },
    { code: 500, description: 'Internal Server Error - Server error occurred' }
  ];

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">API Documentation</h1>
        <p className="text-gray-600">
          Complete reference for the Me-API Playground RESTful API endpoints.
        </p>
      </div>

      {/* API Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">API Status</h2>
            {loading ? (
              <LoadingSpinner size="small" />
            ) : apiHealth ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-600 font-medium">API Operational</span>
                </div>
                <div className="text-sm text-gray-600">
                  Environment: {apiHealth.environment} | Uptime: {Math.floor(apiHealth.uptime / 60)} minutes
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
                <span className="text-red-600">Unable to connect to API</span>
              </div>
            )}
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-500">Base URL</div>
            <div className="font-mono text-sm bg-gray-100 px-3 py-1 rounded">
              http://localhost:3000
            </div>
          </div>
        </div>
      </div>

      {/* Authentication */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Authentication</h2>
        <p className="text-gray-700 mb-4">
          The API supports optional authentication for enhanced security. In development mode, 
          authentication is not required.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">JWT Token</h3>
            <div className="bg-white p-3 rounded border font-mono text-sm">
              Authorization: Bearer &lt;token&gt;
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">API Key</h3>
            <div className="bg-white p-3 rounded border font-mono text-sm">
              X-API-Key: &lt;api-key&gt;
            </div>
          </div>
        </div>
      </div>

      {/* Rate Limiting */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Rate Limiting</h2>
        <p className="text-gray-700">
          API requests are limited to <strong>100 requests per 15 minutes</strong> per IP address 
          to ensure fair usage and system stability.
        </p>
      </div>

      {/* Endpoints */}
      <div className="space-y-8">
        {endpoints.map((category) => (
          <div key={category.category} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">{category.category} Endpoints</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {category.endpoints.map((endpoint, index) => (
                <div key={index} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                          endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                          endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                          endpoint.method === 'PATCH' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {endpoint.method}
                        </span>
                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                          {endpoint.path}
                        </code>
                      </div>
                      <p className="text-gray-600 text-sm">{endpoint.description}</p>
                    </div>
                    
                    <button
                      onClick={() => copyToClipboard(endpoint.example, `${endpoint.method}-${endpoint.path}`)}
                      className="flex items-center text-gray-500 hover:text-gray-700 text-sm"
                    >
                      {copiedEndpoint === `${endpoint.method}-${endpoint.path}` ? (
                        <CheckIcon className="h-4 w-4 text-green-500" />
                      ) : (
                        <ClipboardDocumentIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Parameters */}
                  {endpoint.parameters && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Parameters</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-2 font-medium text-gray-900">Name</th>
                              <th className="text-left py-2 font-medium text-gray-900">Type</th>
                              <th className="text-left py-2 font-medium text-gray-900">Required</th>
                              <th className="text-left py-2 font-medium text-gray-900">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {endpoint.parameters.map((param, idx) => (
                              <tr key={idx} className="border-b border-gray-100">
                                <td className="py-2 font-mono text-gray-700">{param.name}</td>
                                <td className="py-2 text-gray-600">{param.type}</td>
                                <td className="py-2">
                                  {param.required ? (
                                    <span className="text-red-600">Yes</span>
                                  ) : (
                                    <span className="text-gray-500">No</span>
                                  )}
                                </td>
                                <td className="py-2 text-gray-600">{param.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Example Request */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Example Request</h4>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      <pre className="text-sm font-mono whitespace-pre-wrap">{endpoint.example}</pre>
                    </div>
                  </div>

                  {/* Example Response */}
                  {endpoint.response && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Example Response</h4>
                      <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                        <pre className="text-sm font-mono text-gray-700 whitespace-pre-wrap">
                          {endpoint.response}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Status Codes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-8">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">HTTP Status Codes</h2>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-4">
            {statusCodes.map((status) => (
              <div key={status.code} className="flex items-start space-x-3">
                <span className={`px-2 py-1 rounded text-xs font-mono ${
                  status.code < 300 ? 'bg-green-100 text-green-800' :
                  status.code < 400 ? 'bg-blue-100 text-blue-800' :
                  status.code < 500 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {status.code}
                </span>
                <span className="text-sm text-gray-700">{status.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>
          For more information or support, please visit our{' '}
          <a href="https://github.com/alexjohnson/me-api-playground" className="text-blue-600 hover:text-blue-800">
            GitHub repository
          </a>
        </p>
      </div>
    </div>
  );
};

export default ApiDocs;