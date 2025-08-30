import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { FunnelIcon, Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    skill: '',
    featured: ''
  });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('priority');
  const [sortOrder, setSortOrder] = useState('DESC');

  useEffect(() => {
    fetchProjects();
  }, [filters, sortBy, sortOrder]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        sort: sortBy,
        order: sortOrder,
        limit: 50
      };
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await apiService.projects.getAll(params);
      setProjects(response.data.data);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      skill: '',
      featured: ''
    });
  };

  const statusOptions = ['Planning', 'In Progress', 'Completed', 'On Hold', 'Archived'];
  const sortOptions = [
    { value: 'priority', label: 'Priority' },
    { value: 'created_at', label: 'Date Created' },
    { value: 'updated_at', label: 'Last Updated' },
    { value: 'title', label: 'Title' }
  ];

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
        <p className="text-gray-600">
          Explore my portfolio of web applications, APIs, and development projects.
        </p>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4">
            {/* Status Filter */}
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="input py-2 text-sm"
              >
                <option value="">All Status</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Skill Filter */}
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Skill
              </label>
              <input
                type="text"
                placeholder="e.g., React, Node.js"
                value={filters.skill}
                onChange={(e) => handleFilterChange('skill', e.target.value)}
                className="input py-2 text-sm"
              />
            </div>

            {/* Featured Filter */}
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Featured
              </label>
              <select
                value={filters.featured}
                onChange={(e) => handleFilterChange('featured', e.target.value)}
                className="input py-2 text-sm"
              >
                <option value="">All Projects</option>
                <option value="true">Featured Only</option>
                <option value="false">Non-Featured</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(filters.status || filters.skill || filters.featured) && (
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="btn-secondary text-sm"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Sort Controls */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input py-2 text-sm"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'DESC' ? 'ASC' : 'DESC')}
                className="btn-secondary text-sm"
              >
                {sortOrder === 'DESC' ? '↓' : '↑'}
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Squares2X2Icon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ListBulletIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      ) : (
        <>
          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              {projects.length} project{projects.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Projects Grid/List */}
          {projects.length > 0 ? (
            <div className={
              viewMode === 'grid' 
                ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-6'
            }>
              {projects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  viewMode={viewMode} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FunnelIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No projects found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your filters or search criteria.
              </p>
              <button
                onClick={clearFilters}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const ProjectCard = ({ project, viewMode }) => {
  const getStatusColor = (status) => {
    const colors = {
      'Planning': 'bg-yellow-100 text-yellow-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-green-100 text-green-800',
      'On Hold': 'bg-orange-100 text-orange-800',
      'Archived': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (viewMode === 'list') {
    return (
      <div className="card p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold">
                <Link 
                  to={`/projects/${project.id}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {project.title}
                </Link>
              </h3>
              {project.is_featured && (
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                  Featured
                </span>
              )}
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>
            <p className="text-gray-600 mb-4 line-clamp-2">
              {project.short_description || project.description}
            </p>
            
            {/* Skills */}
            {project.skills && project.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {project.skills.slice(0, 5).map((skill) => (
                  <span 
                    key={skill.id}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                  >
                    {skill.name}
                  </span>
                ))}
                {project.skills.length > 5 && (
                  <span className="text-xs text-gray-500">
                    +{project.skills.length - 5} more
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 ml-4">
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm"
              >
                <FaExternalLinkAlt className="h-3 w-3 mr-1" />
                Demo
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm"
              >
                <FaGithub className="h-3 w-3 mr-1" />
                Code
              </a>
            )}
            <Link
              to={`/projects/${project.id}`}
              className="btn-primary text-sm"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="card group hover:shadow-lg transition-shadow">
      {project.image_url && (
        <div className="aspect-video overflow-hidden">
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold">
            <Link 
              to={`/projects/${project.id}`}
              className="hover:text-blue-600 transition-colors"
            >
              {project.title}
            </Link>
          </h3>
          {project.is_featured && (
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
              Featured
            </span>
          )}
        </div>
        
        <div className="mb-3">
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {project.short_description || project.description}
        </p>
        
        {/* Skills */}
        {project.skills && project.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {project.skills.slice(0, 3).map((skill) => (
              <span 
                key={skill.id}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
              >
                {skill.name}
              </span>
            ))}
            {project.skills.length > 3 && (
              <span className="text-xs text-gray-500">
                +{project.skills.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600"
              >
                <FaExternalLinkAlt className="h-4 w-4" />
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600"
              >
                <FaGithub className="h-4 w-4" />
              </a>
            )}
          </div>
          
          <Link
            to={`/projects/${project.id}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            Learn More →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Projects;