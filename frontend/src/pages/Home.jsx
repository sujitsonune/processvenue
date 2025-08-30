import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, CodeBracketIcon, ServerIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { FaGithub, FaLinkedin, FaExternalLinkAlt } from 'react-icons/fa';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [topSkills, setTopSkills] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [apiHealth, setApiHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [profileRes, skillsRes, projectsRes, healthRes] = await Promise.all([
        apiService.profile.get(),
        apiService.skills.getTop({ limit: 6 }),
        apiService.projects.getAll({ featured: true, limit: 3 }),
        apiService.health()
      ]);

      setProfile(profileRes.data.data);
      setTopSkills(skillsRes.data.data);
      setFeaturedProjects(projectsRes.data.data);
      setApiHealth(healthRes.data);
    } catch (error) {
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {profile?.name || 'Full-Stack Developer'}
              </h1>
              <p className="text-xl mb-4 text-blue-100">
                {profile?.title || 'Building exceptional digital experiences'}
              </p>
              <p className="text-lg mb-8 text-blue-200 leading-relaxed">
                {profile?.bio?.substring(0, 200)}...
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4 mb-8">
                {profile?.github_url && (
                  <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-colors"
                  >
                    <FaGithub className="h-6 w-6" />
                  </a>
                )}
                {profile?.linkedin_url && (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-colors"
                  >
                    <FaLinkedin className="h-6 w-6" />
                  </a>
                )}
                {profile?.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-colors"
                  >
                    <FaExternalLinkAlt className="h-6 w-6" />
                  </a>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/projects"
                  className="btn-primary bg-white text-blue-600 hover:bg-gray-100 flex items-center"
                >
                  View My Work
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  to="/api-docs"
                  className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600"
                >
                  Explore API
                </Link>
              </div>
            </div>

            {/* Profile Image */}
            <div className="flex justify-center lg:justify-end animate-float">
              <div className="relative">
                <div className="w-72 h-72 rounded-full overflow-hidden border-8 border-white/20 shadow-2xl">
                  {profile?.profile_image_url ? (
                    <img
                      src={profile.profile_image_url}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <span className="text-6xl font-bold text-white">
                        {profile?.name?.charAt(0) || 'A'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-4 -right-4 bg-green-500 w-12 h-12 rounded-full flex items-center justify-center border-4 border-white">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API Status Section */}
      <section className="container">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title">API Playground</h2>
            {apiHealth && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">API Operational</span>
              </div>
            )}
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <ServerIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">RESTful API</h3>
              <p className="text-sm text-gray-600">
                Full-featured backend with comprehensive endpoints
              </p>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <CodeBracketIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Live Demo</h3>
              <p className="text-sm text-gray-600">
                Interactive frontend showcasing API capabilities
              </p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <DocumentTextIcon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Documentation</h3>
              <p className="text-sm text-gray-600">
                Complete API documentation with examples
              </p>
            </div>
          </div>

          {apiHealth && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Environment: {apiHealth.environment}</span>
                <span>Uptime: {Math.floor(apiHealth.uptime / 60)} minutes</span>
                <span>Memory: {apiHealth.memory?.used}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Top Skills Section */}
      <section className="container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="section-title">Featured Skills</h2>
          <Link
            to="/skills"
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            View All Skills
            <ArrowRightIcon className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topSkills.map((skill) => (
            <div key={skill.id} className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">{skill.name}</h3>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {skill.proficiency_level}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{skill.category}</p>
              {skill.years_of_experience && (
                <p className="text-xs text-gray-500">
                  {skill.years_of_experience} years experience
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="section-title">Featured Projects</h2>
          <Link
            to="/projects"
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            View All Projects
            <ArrowRightIcon className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <div key={project.id} className="card group hover:shadow-lg transition-shadow">
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
                <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {project.short_description || project.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <Link
                    to={`/projects/${project.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                  >
                    Learn More
                    <ArrowRightIcon className="ml-1 h-3 w-3" />
                  </Link>
                  
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;