import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaGithub, FaExternalLinkAlt, FaArrowLeft, FaCalendarAlt } from 'react-icons/fa';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await apiService.projects.getById(id);
      setProject(response.data.data);
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error('Project not found');
        navigate('/projects');
      } else {
        toast.error('Failed to load project details');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Planning': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
      'Completed': 'bg-green-100 text-green-800 border-green-200',
      'On Hold': 'bg-orange-100 text-orange-800 border-orange-200',
      'Archived': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityColor = (priority) => {
    if (priority >= 8) return 'bg-red-100 text-red-800';
    if (priority >= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Project Not Found</h2>
          <p className="text-gray-600 mt-2">The project you're looking for doesn't exist.</p>
          <Link to="/projects" className="btn-primary mt-4">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Back Navigation */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <FaArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Project Header */}
          <div className="card p-8">
            {project.image_url && (
              <div className="aspect-video mb-6 rounded-lg overflow-hidden">
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
                {project.short_description && (
                  <p className="text-xl text-gray-600 mb-4">{project.short_description}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {project.is_featured && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    ⭐ Featured
                  </span>
                )}
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex items-center"
                >
                  <FaExternalLinkAlt className="h-4 w-4 mr-2" />
                  Live Demo
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex items-center"
                >
                  <FaGithub className="h-4 w-4 mr-2" />
                  Source Code
                </a>
              )}
              {project.project_url && (
                <a
                  href={project.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex items-center"
                >
                  <FaExternalLinkAlt className="h-4 w-4 mr-2" />
                  Project Site
                </a>
              )}
            </div>

            {/* Project Description */}
            <div className="prose prose-gray max-w-none">
              <h2>About This Project</h2>
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {project.description}
              </div>
            </div>
          </div>

          {/* Technologies Used */}
          {project.skills && project.skills.length > 0 && (
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Technologies Used</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {project.skills.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-900">{skill.name}</span>
                      <div className="text-sm text-gray-600">{skill.category}</div>
                    </div>
                    {skill.ProjectSkill?.proficiency_used && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {skill.ProjectSkill.proficiency_used}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Info */}
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Project Information</h3>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-500 block">Status</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium mt-1 ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-500 block">Priority</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium mt-1 ${getPriorityColor(project.priority)}`}>
                  {project.priority}/10
                </span>
              </div>

              {project.start_date && (
                <div>
                  <span className="text-sm font-medium text-gray-500 block">Start Date</span>
                  <div className="flex items-center mt-1 text-sm text-gray-700">
                    <FaCalendarAlt className="h-3 w-3 mr-2" />
                    {formatDate(project.start_date)}
                  </div>
                </div>
              )}

              {project.end_date && (
                <div>
                  <span className="text-sm font-medium text-gray-500 block">End Date</span>
                  <div className="flex items-center mt-1 text-sm text-gray-700">
                    <FaCalendarAlt className="h-3 w-3 mr-2" />
                    {formatDate(project.end_date)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  View Live Demo
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  View Source Code
                </a>
              )}
              <Link
                to="/projects"
                className="block w-full text-center py-2 px-4 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Browse More Projects
              </Link>
            </div>
          </div>

          {/* Skills Summary */}
          {project.skills && project.skills.length > 0 && (
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Skills Overview</h3>
              <div className="flex flex-wrap gap-2">
                {project.skills.slice(0, 8).map((skill) => (
                  <span
                    key={skill.id}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {skill.name}
                  </span>
                ))}
                {project.skills.length > 8 && (
                  <span className="text-xs text-gray-500">
                    +{project.skills.length - 8} more
                  </span>
                )}
              </div>
              <Link
                to="/skills"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-3 inline-block"
              >
                View All Skills →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;