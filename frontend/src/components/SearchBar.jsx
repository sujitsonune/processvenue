import React, { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { apiService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(null);
  
  const searchRef = useRef(null);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  // Debounced search
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (query.trim().length < 2) {
      setResults(null);
      setShowResults(false);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      performSearch();
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const performSearch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.search({ q: query });
      setResults(response.data.data);
      setShowResults(true);
    } catch (err) {
      setError('Search failed. Please try again.');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults(null);
    setShowResults(false);
    setError(null);
  };

  const handleResultClick = (type, id) => {
    setShowResults(false);
    setQuery('');
    
    if (type === 'project') {
      navigate(`/projects/${id}`);
    } else if (type === 'skill') {
      navigate('/skills');
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Search projects, skills..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results && setShowResults(true)}
        />
        {(query || loading) && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {loading ? (
              <LoadingSpinner size="small" />
            ) : (
              <button
                onClick={clearSearch}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Search Results */}
      {showResults && (query.length >= 2) && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-96 overflow-y-auto">
          {error ? (
            <div className="p-3 text-sm text-red-600">
              {error}
            </div>
          ) : results ? (
            <div className="py-2">
              {/* Projects */}
              {results.projects && results.projects.length > 0 && (
                <div className="px-3 py-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Projects ({results.projects.length})
                  </div>
                  {results.projects.map((project) => (
                    <button
                      key={`project-${project.id}`}
                      onClick={() => handleResultClick('project', project.id)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md flex items-start space-x-3"
                    >
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="font-medium text-gray-900">{project.title}</div>
                        <div className="text-gray-500 text-xs line-clamp-2">
                          {project.short_description || project.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Skills */}
              {results.skills && results.skills.length > 0 && (
                <div className="px-3 py-2 border-t border-gray-100">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Skills ({results.skills.length})
                  </div>
                  {results.skills.map((skill) => (
                    <button
                      key={`skill-${skill.id}`}
                      onClick={() => handleResultClick('skill', skill.id)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full flex-shrink-0"></div>
                        <span className="font-medium text-gray-900">{skill.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">{skill.proficiency_level}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* No results */}
              {(!results.projects || results.projects.length === 0) &&
               (!results.skills || results.skills.length === 0) && (
                <div className="px-3 py-6 text-center text-sm text-gray-500">
                  No results found for "{query}"
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;