import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaDownload, FaMapMarkerAlt, FaEnvelope, FaPhone, FaGlobe } from 'react-icons/fa';
import toast from 'react-hot-toast';

const About = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await apiService.profile.get();
      setProfile(response.data.data);
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

  if (!profile) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Profile Not Found</h2>
          <p className="text-gray-600 mt-2">Unable to load profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl text-white p-8 mb-8">
        <div className="grid lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">About {profile.name}</h1>
            <p className="text-xl text-blue-100 mb-6">{profile.title}</p>
            
            {/* Contact Info */}
            <div className="grid md:grid-cols-2 gap-4 text-blue-100">
              {profile.location && (
                <div className="flex items-center">
                  <FaMapMarkerAlt className="h-4 w-4 mr-2" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.email && (
                <div className="flex items-center">
                  <FaEnvelope className="h-4 w-4 mr-2" />
                  <a href={`mailto:${profile.email}`} className="hover:text-white transition-colors">
                    {profile.email}
                  </a>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center">
                  <FaPhone className="h-4 w-4 mr-2" />
                  <a href={`tel:${profile.phone}`} className="hover:text-white transition-colors">
                    {profile.phone}
                  </a>
                </div>
              )}
              {profile.website && (
                <div className="flex items-center">
                  <FaGlobe className="h-4 w-4 mr-2" />
                  <a 
                    href={profile.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Portfolio Website
                  </a>
                </div>
              )}
            </div>

            {/* Resume Download */}
            {profile.resume_url && (
              <div className="mt-6">
                <a
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  <FaDownload className="h-4 w-4 mr-2" />
                  Download Resume
                </a>
              </div>
            )}
          </div>

          {/* Profile Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl">
                {profile.profile_image_url ? (
                  <img
                    src={profile.profile_image_url}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">
                      {profile.name?.charAt(0) || 'A'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Bio Section */}
          <section className="card p-6">
            <h2 className="section-title">About Me</h2>
            <div className="prose prose-gray max-w-none">
              {profile.bio ? (
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {profile.bio}
                </div>
              ) : (
                <p className="text-gray-500 italic">No bio available.</p>
              )}
            </div>
          </section>

          {/* Work Experience */}
          {profile.work_experiences && profile.work_experiences.length > 0 && (
            <section className="card p-6">
              <h2 className="section-title">Work Experience</h2>
              <div className="space-y-6">
                {profile.work_experiences.map((experience, index) => (
                  <div key={experience.id} className="relative">
                    {index !== profile.work_experiences.length - 1 && (
                      <div className="absolute left-4 top-12 bottom-0 w-0.5 bg-gray-200"></div>
                    )}
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {experience.position}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {new Date(experience.start_date).getFullYear()} - {
                              experience.end_date 
                                ? new Date(experience.end_date).getFullYear()
                                : 'Present'
                            }
                          </span>
                        </div>
                        
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                          <p className="text-blue-600 font-medium">{experience.company_name}</p>
                          {experience.location && (
                            <p className="text-sm text-gray-500">{experience.location}</p>
                          )}
                        </div>

                        {experience.description && (
                          <p className="text-gray-700 mb-3">{experience.description}</p>
                        )}

                        {experience.responsibilities && experience.responsibilities.length > 0 && (
                          <div className="mb-3">
                            <h4 className="font-medium text-gray-900 mb-2">Key Responsibilities:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                              {experience.responsibilities.map((responsibility, idx) => (
                                <li key={idx}>{responsibility}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {experience.achievements && experience.achievements.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Key Achievements:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                              {experience.achievements.map((achievement, idx) => (
                                <li key={idx}>{achievement}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {profile.educations && profile.educations.length > 0 && (
            <section className="card p-6">
              <h2 className="section-title">Education</h2>
              <div className="space-y-6">
                {profile.educations.map((education, index) => (
                  <div key={education.id} className="relative">
                    {index !== profile.educations.length - 1 && (
                      <div className="absolute left-4 top-12 bottom-0 w-0.5 bg-gray-200"></div>
                    )}
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {education.degree}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {new Date(education.start_date).getFullYear()} - {
                              education.end_date 
                                ? new Date(education.end_date).getFullYear()
                                : 'Present'
                            }
                          </span>
                        </div>
                        
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                          <p className="text-green-600 font-medium">{education.institution_name}</p>
                          {education.location && (
                            <p className="text-sm text-gray-500">{education.location}</p>
                          )}
                        </div>

                        {education.field_of_study && (
                          <p className="text-gray-700 mb-2">
                            <strong>Field of Study:</strong> {education.field_of_study}
                          </p>
                        )}

                        {education.gpa && (
                          <p className="text-gray-700 mb-2">
                            <strong>GPA:</strong> {education.gpa}/4.0
                          </p>
                        )}

                        {education.description && (
                          <p className="text-gray-700 mb-3">{education.description}</p>
                        )}

                        {education.achievements && education.achievements.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Achievements:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                              {education.achievements.map((achievement, idx) => (
                                <li key={idx}>{achievement}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Years Experience</span>
                <span className="font-semibold">5+</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Projects Completed</span>
                <span className="font-semibold">15+</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Technologies</span>
                <span className="font-semibold">20+</span>
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Get In Touch</h3>
            <p className="text-gray-600 mb-4">
              Interested in working together? Let's connect and discuss opportunities.
            </p>
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="btn-primary w-full text-center"
              >
                Send Email
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;