const { User, Project, Skill, WorkExperience, Education } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

const search = async (req, res) => {
  try {
    const { q, type, limit = 50, offset = 0 } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const searchTerm = q.trim();
    const searchCondition = {
      [Op.iLike]: `%${searchTerm}%`
    };

    let results = {};

    // Search in different entities based on type filter
    if (!type || type === 'all' || type === 'profile') {
      const profiles = await User.findAll({
        where: {
          [Op.or]: [
            { name: searchCondition },
            { bio: searchCondition },
            { title: searchCondition },
            { location: searchCondition }
          ]
        },
        limit: type === 'profile' ? parseInt(limit) : 10
      });
      results.profiles = profiles;
    }

    if (!type || type === 'all' || type === 'projects') {
      const projects = await Project.findAll({
        where: {
          [Op.or]: [
            { title: searchCondition },
            { description: searchCondition },
            { short_description: searchCondition }
          ]
        },
        include: [{
          model: Skill,
          as: 'skills',
          through: { attributes: [] }
        }],
        limit: type === 'projects' ? parseInt(limit) : 10,
        offset: type === 'projects' ? parseInt(offset) : 0,
        order: [['priority', 'DESC'], ['updated_at', 'DESC']]
      });
      results.projects = projects;
    }

    if (!type || type === 'all' || type === 'skills') {
      const skills = await Skill.findAll({
        where: {
          [Op.or]: [
            { name: searchCondition },
            { description: searchCondition },
            { category: searchCondition }
          ]
        },
        limit: type === 'skills' ? parseInt(limit) : 10,
        order: [['is_featured', 'DESC'], ['name', 'ASC']]
      });
      results.skills = skills;
    }

    if (!type || type === 'all' || type === 'experience') {
      const workExperiences = await WorkExperience.findAll({
        where: {
          [Op.or]: [
            { company_name: searchCondition },
            { position: searchCondition },
            { description: searchCondition },
            { location: searchCondition }
          ]
        },
        limit: type === 'experience' ? parseInt(limit) : 10,
        order: [['start_date', 'DESC']]
      });
      results.work_experiences = workExperiences;
    }

    if (!type || type === 'all' || type === 'education') {
      const educations = await Education.findAll({
        where: {
          [Op.or]: [
            { institution_name: searchCondition },
            { degree: searchCondition },
            { field_of_study: searchCondition },
            { description: searchCondition }
          ]
        },
        limit: type === 'education' ? parseInt(limit) : 10,
        order: [['start_date', 'DESC']]
      });
      results.educations = educations;
    }

    // Calculate total results
    const totalResults = Object.values(results).reduce((sum, items) => sum + items.length, 0);

    res.status(200).json({
      success: true,
      query: searchTerm,
      total_results: totalResults,
      data: results,
      pagination: type && type !== 'all' ? {
        limit: parseInt(limit),
        offset: parseInt(offset)
      } : undefined
    });

  } catch (error) {
    logger.error('Error performing search:', error);
    res.status(500).json({
      success: false,
      message: 'Error performing search'
    });
  }
};

module.exports = {
  search
};