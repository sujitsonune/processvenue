import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { FunnelIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    proficiency: '',
    featured: ''
  });

  useEffect(() => {
    fetchSkills();
  }, [filters]);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const params = { ...filters, limit: 100 };
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await apiService.skills.getAll(params);
      setSkills(response.data.data);
    } catch (error) {
      toast.error('Failed to load skills');
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
      category: '',
      proficiency: '',
      featured: ''
    });
  };

  const categoryOptions = [
    'Programming Languages',
    'Frameworks',
    'Databases',
    'Tools',
    'Cloud Services',
    'Other'
  ];

  const proficiencyOptions = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const getProficiencyColor = (level) => {
    const colors = {
      'Beginner': 'bg-yellow-100 text-yellow-800',
      'Intermediate': 'bg-blue-100 text-blue-800',
      'Advanced': 'bg-purple-100 text-purple-800',
      'Expert': 'bg-green-100 text-green-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Programming Languages': 'bg-red-50 border-red-200',
      'Frameworks': 'bg-blue-50 border-blue-200',
      'Databases': 'bg-green-50 border-green-200',
      'Tools': 'bg-purple-50 border-purple-200',
      'Cloud Services': 'bg-orange-50 border-orange-200',
      'Other': 'bg-gray-50 border-gray-200'
    };
    return colors[category] || 'bg-gray-50 border-gray-200';
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Technical Skills</h1>
        <p className="text-gray-600">
          My technical expertise across various programming languages, frameworks, and tools.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4">
            {/* Category Filter */}
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="input py-2 text-sm"
              >
                <option value="">All Categories</option>
                {categoryOptions.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Proficiency Filter */}
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Proficiency
              </label>
              <select
                value={filters.proficiency}
                onChange={(e) => handleFilterChange('proficiency', e.target.value)}
                className="input py-2 text-sm"
              >
                <option value="">All Levels</option>
                {proficiencyOptions.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
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
                <option value="">All Skills</option>
                <option value="true">Featured Only</option>
                <option value="false">Non-Featured</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(filters.category || filters.proficiency || filters.featured) && (
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
              {skills.length} skill{skills.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Skills Display */}
          {skills.length > 0 ? (
            <div className="space-y-8">
              {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                <div key={category} className={`rounded-lg border-2 ${getCategoryColor(category)} p-6`}>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">{category}</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categorySkills.map((skill) => (
                      <div key={skill.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900">{skill.name}</h3>
                            {skill.is_featured && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                ⭐
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Proficiency:</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${getProficiencyColor(skill.proficiency_level)}`}>
                              {skill.proficiency_level}
                            </span>
                          </div>
                          
                          {skill.years_of_experience && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Experience:</span>
                              <span className="text-sm font-medium text-gray-900">
                                {skill.years_of_experience} year{skill.years_of_experience !== 1 ? 's' : ''}
                              </span>
                            </div>
                          )}
                        </div>

                        {skill.description && (
                          <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                            {skill.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FunnelIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No skills found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your filters to see more skills.
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

export default Skills;