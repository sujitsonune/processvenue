const { Skill } = require('../models');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

const getSkills = async (req, res) => {
  try {
    const { category, proficiency, featured, limit = 50, offset = 0 } = req.query;
    
    let whereClause = {};
    
    if (category) {
      whereClause.category = category;
    }
    
    if (proficiency) {
      whereClause.proficiency_level = proficiency;
    }
    
    if (featured !== undefined) {
      whereClause.is_featured = featured === 'true';
    }

    const skills = await Skill.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: skills.rows,
      pagination: {
        total: skills.count,
        limit: parseInt(limit),
        offset: parseInt(offset),
        pages: Math.ceil(skills.count / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error('Error fetching skills:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching skills'
    });
  }
};

const getTopSkills = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const skills = await Skill.findAll({
      where: {
        is_featured: true
      },
      limit: parseInt(limit),
      order: [['years_of_experience', 'DESC'], ['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: skills
    });
  } catch (error) {
    logger.error('Error fetching top skills:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching top skills'
    });
  }
};

const createSkill = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const skill = await Skill.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Skill created successfully',
      data: skill
    });
  } catch (error) {
    logger.error('Error creating skill:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating skill'
    });
  }
};

module.exports = {
  getSkills,
  getTopSkills,
  createSkill
};