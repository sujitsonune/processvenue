const { Project, Skill, User, ProjectSkill } = require('../models');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

const getProjects = async (req, res) => {
  try {
    const { 
      skill, 
      status, 
      featured, 
      limit = 20, 
      offset = 0,
      sort = 'priority',
      order = 'DESC' 
    } = req.query;
    
    let whereClause = { user_id: 1 }; // Assuming single user for now
    let include = [{
      model: Skill,
      as: 'skills',
      through: { attributes: [] }
    }];
    
    if (status) {
      whereClause.status = status;
    }
    
    if (featured !== undefined) {
      whereClause.is_featured = featured === 'true';
    }

    // Filter by skill
    if (skill) {
      include[0].where = {
        name: {
          [Op.iLike]: `%${skill}%`
        }
      };
      include[0].required = true;
    }

    const projects = await Project.findAndCountAll({
      where: whereClause,
      include,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sort, order.toUpperCase()]],
      distinct: true
    });

    res.status(200).json({
      success: true,
      data: projects.rows,
      pagination: {
        total: projects.count,
        limit: parseInt(limit),
        offset: parseInt(offset),
        pages: Math.ceil(projects.count / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching projects'
    });
  }
};

const getProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findOne({
      where: { 
        id,
        user_id: 1 // Assuming single user for now
      },
      include: [{
        model: Skill,
        as: 'skills',
        through: { attributes: ['proficiency_used'] }
      }]
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    logger.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching project'
    });
  }
};

const createProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { skills, ...projectData } = req.body;
    projectData.user_id = 1; // Assuming single user for now

    const project = await Project.create(projectData);

    // Add skills if provided
    if (skills && Array.isArray(skills)) {
      for (const skillData of skills) {
        const skill = await Skill.findByPk(skillData.skill_id);
        if (skill) {
          await ProjectSkill.create({
            project_id: project.id,
            skill_id: skillData.skill_id,
            proficiency_used: skillData.proficiency_used
          });
        }
      }
    }

    // Fetch the created project with skills
    const createdProject = await Project.findByPk(project.id, {
      include: [{
        model: Skill,
        as: 'skills',
        through: { attributes: ['proficiency_used'] }
      }]
    });
    
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: createdProject
    });
  } catch (error) {
    logger.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating project'
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { skills, ...projectData } = req.body;

    const [updated] = await Project.update(projectData, {
      where: { 
        id,
        user_id: 1 // Assuming single user for now
      }
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const project = await Project.findByPk(id, {
      include: [{
        model: Skill,
        as: 'skills',
        through: { attributes: ['proficiency_used'] }
      }]
    });

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    logger.error('Error updating project:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating project'
    });
  }
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject
};